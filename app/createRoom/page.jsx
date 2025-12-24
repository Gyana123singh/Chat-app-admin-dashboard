"use client";

import { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateRoomPage() {
  const router = useRouter();

  const tabs = ["Game-Carrom", "Game-Ludo", "Chat"];
  const [activeTab, setActiveTab] = useState("Chat");
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await axios.post(
        "https://chat-app-1-qvl9.onrender.com/api/rooms/create",
        { mode: activeTab },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ GET UUID
      const roomId = res.data.room?.roomId;
      if (!roomId) return alert("Room ID missing");
      console.log("roomId ", roomId);

      // ✅ REDIRECT WITH ROOM ID
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error(
        "CREATE ROOM ERROR:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Room creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[420px] mx-auto min-h-screen bg-white px-4 relative">
      {/* HEADER */}
      <div className="flex items-center gap-3 py-4">
        <HiArrowLeft
          className="text-xl cursor-pointer"
          onClick={() => router.back()}
        />
      </div>

      {/* TITLE */}
      <h1 className="text-xl font-semibold mb-4 text-center">❤️ Nicholas ❤️</h1>

      <hr className="mb-6" />

      {/* TABS */}
      <div className="flex gap-3 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                activeTab === tab
                  ? "bg-teal-400 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CREATE BUTTON */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[420px] px-4">
        <button
          onClick={handleCreateRoom}
          disabled={loading}
          className="w-full bg-teal-400 text-white py-4 rounded-full text-lg font-medium disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
}
