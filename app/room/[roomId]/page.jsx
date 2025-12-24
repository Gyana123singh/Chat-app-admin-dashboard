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
  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(false);

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
    const user = JSON.parse(localStorage.getItem("user"));

    /* REST JOIN */
    await axios.post(
      `http://localhost:5000/api/rooms/${roomId}/join`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    /* SOCKET CONNECT */
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
    });

    registerRoomEvents(socketRef.current, setParticipants);

    socketRef.current.on("connect", async () => {
      socketRef.current.emit("room:join", { roomId });

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
          {participants.map((u, i) => (
            <div key={i} className="text-center">
              <Image src="/avatar.png" width={48} height={48} alt="user" />
              <p className="text-xs">{u.username}</p>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 flex gap-4 p-3 bg-black/70">
        <button onClick={toggleMic}>
          <HiOutlineMicrophone />
        </button>
        <HiOutlineVolumeUp />
        <HiOutlineFaceSmile />
        <BsGiftFill />
      </div>
    </div>
  );
}
