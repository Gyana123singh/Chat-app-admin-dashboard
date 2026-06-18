"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { io } from "socket.io-client";

import {
  HiOutlineBriefcase,
  HiOutlineShare,
  HiOutlineMicrophone,
  HiOutlineVolumeUp,
  HiOutlineVolumeOff,
} from "react-icons/hi";
import { HiOutlineFaceSmile } from "react-icons/hi2";
import { BsGiftFill } from "react-icons/bs";

import { registerRoomEvents } from "../../utils/roomEvents";

const TOTAL_SLOTS = 100;
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "https://chat-app-1-qvl9.onrender.com";

export default function RoomPage() {
  const { roomId } = useParams();

  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [lockedSeats, setLockedSeats] = useState([]);
  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({});

  /* ================= FETCH ROOM ================= */
  useEffect(() => {
    if (!roomId) return;

    const loadRoom = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const res = await axios.get(
          `http://localhost:5000/api/rooms/${roomId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setRoom(res.data.room);
      } catch (err) {
        alert("Room not found");
      }
    };

    loadRoom();
  }, [roomId]);

  /* ================= CLEANUP ================= */
  useEffect(() => {
    return () => {
      Object.values(peersRef.current).forEach((pc) => pc.close());
      socketRef.current?.disconnect();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  /* ================= JOIN ROOM ================= */
  const handleJoin = async () => {
    if (joined || !roomId) return;

    const token = localStorage.getItem("authToken");
    let password = null;

    try {
      /* REST JOIN */
      await axios.post(
        `http://localhost:5000/api/rooms/${roomId}/join`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      if (err.response?.data?.isLocked) {
        const enteredPass = prompt("Enter Room Password:");
        if (!enteredPass) return;
        password = enteredPass;
        try {
          await axios.post(
            `http://localhost:5000/api/rooms/${roomId}/join`,
            { password },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (innerErr) {
          alert(innerErr.response?.data?.message || "Failed to join room");
          return;
        }
      } else {
        alert(err.response?.data?.message || "Failed to join room");
        return;
      }
    }

    /* SOCKET CONNECT */
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
    });

    registerRoomEvents(socketRef.current, setParticipants, setLockedSeats);

    socketRef.current.on("connect", async () => {
      socketRef.current.emit("room:join", { roomId, password });

      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      setJoined(true);
      setMicOn(true);
    });

    /* USERS IN ROOM */
    socketRef.current.on("room:users", (users) => {
      setParticipants(users);
    });
  };

  /* ================= MIC ================= */
  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;

    track.enabled = !micOn;
    setMicOn(!micOn);
  };

  const toggleSound = () => {
    const nextMuted = !soundMuted;
    setSoundMuted(nextMuted);
    if (socketRef.current) {
      socketRef.current.emit("sound:state", nextMuted);
    }
  };

  if (!room) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <Image src="/avatar.png" width={32} height={32} alt="avatar" />
          <div className="text-xs">
            <p>{room.creatorName}</p>
            <p>ID: {room.roomId}</p>
          </div>
          <button
            onClick={handleJoin}
            className="bg-green-500 px-3 py-1 rounded-full"
          >
            {joined ? "Joined" : "Join"}
          </button>
        </div>

        <div className="flex gap-3">
          <HiOutlineBriefcase />
          <HiOutlineShare />
        </div>
      </div>

      {/* PARTICIPANTS */}
      {joined && (
        <div className="grid grid-cols-5 gap-4 p-4">
          {(() => {
            const seatCount = room?.seatCount || 10;
            const seatsArr = new Array(seatCount).fill(null).map((_, idx) => {
              const user = participants.find((p) => p.seatIndex === idx);
              const locked = lockedSeats.includes(idx + 1);
              return (
                <div
                  key={idx}
                  className="text-center p-2 border rounded relative"
                  onClick={() => {
                    if (!socketRef.current) return;
                    if (locked) {
                      alert("This seat is locked");
                      return;
                    }
                    socketRef.current.emit("room:takeSeat", { roomId, seatNumber: idx + 1 });
                  }}
                >
                  <Image src="/avatar.png" width={48} height={48} alt="user" />
                  <p className="text-xs">{user ? user.username : `Seat ${idx + 1}`}</p>
                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-yellow-300">
                      Locked
                    </div>
                  )}
                </div>
              );
            });
            return seatsArr;
          })()}
        </div>
      )}

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 flex gap-4 p-3 bg-black/70">
        <button onClick={toggleMic}>
          <HiOutlineMicrophone />
        </button>
        <button onClick={toggleSound}>
          {soundMuted ? (
            <HiOutlineVolumeOff className="text-red-400" />
          ) : (
            <HiOutlineVolumeUp className="text-green-400" />
          )}
        </button>
        <HiOutlineFaceSmile />
        <BsGiftFill />
      </div>
    </div>
  );
}
