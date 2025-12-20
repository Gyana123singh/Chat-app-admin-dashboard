"use client";
import Image from "next/image";
import {
  HiOutlineBriefcase,
  HiOutlineShare,
  HiOutlineUserAdd,
} from "react-icons/hi";

import {
  HiOutlineMicrophone,
  HiOutlineVolumeUp,
  HiOutlineEmojiHappy,
} from "react-icons/hi";
import { BsGiftFill } from "react-icons/bs";

export default function RoomPage() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519681393784-d120267933ba')",
      }}
    >
      {/* TOP HEADER */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-3 bg-black/30 px-3 py-2 rounded-full">
          <Image
            src="/avatar.png"
            alt="User"
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="text-xs">
            <p className="font-semibold">las ❤️</p>
            <p className="opacity-70">ID:12971784 · #Chat</p>
          </div>
        </div>

        <div className="flex gap-3 text-xl">
          <HiOutlineBriefcase />
          <HiOutlineShare />
          <HiOutlinePower />
        </div>
      </div>

      {/* TROPHY */}
      <div className="flex items-center gap-2 px-4 mt-4 text-sm">
        🏆 <span>0</span>
      </div>

      {/* USERS */}
      <div className="flex justify-around mt-6 px-4">
        {["Nicholas", "No.2", "No.3", "No.4", "No.5"].map((name, i) => (
          <div key={i} className="flex flex-col items-center text-xs">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center
              ${i === 0 ? "ring-2 ring-green-400" : "bg-white/20"}`}
            >
              {i === 0 ? (
                <Image
                  src="/avatar.png"
                  alt={name}
                  width={52}
                  height={52}
                  className="rounded-full"
                />
              ) : (
                <span>🐺</span>
              )}
            </div>
            <p className="mt-1">{i === 0 ? "1 Nicholas" : name}</p>
          </div>
        ))}
      </div>

      {/* NOTICE */}
      <div className="mx-4 mt-6 bg-black/40 rounded-xl p-4 text-sm leading-relaxed">
        Welcome to the audio room. Any content related to pornography,
        hate-speech, gambling & other illegal topics will banned.
      </div>

      {/* RIGHT ACTIONS */}
      <div className="absolute right-3 bottom-28 flex flex-col gap-4">
        <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <HiOutlineUserAdd />
        </button>
        <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center relative">
          💬
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1 rounded">
            14
          </span>
        </button>
        <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          🎮
        </button>
        <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <BsGiftFill />
        </button>
        <span className="text-xs text-center bg-pink-500 px-2 py-1 rounded-full">
          Benefit
        </span>
      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md px-3 py-2 flex items-center gap-2">
        <button className="p-2 bg-white/20 rounded-full">
          <HiOutlineMicrophone />
        </button>
        <button className="p-2 bg-white/20 rounded-full">
          <HiOutlineVolumeUp />
        </button>

        <div className="flex-1 bg-white/20 rounded-full px-4 py-2 text-sm opacity-80">
          Type something...
        </div>

        <HiOutlineEmojiHappy />
        <span className="font-bold text-pink-400">PK</span>
        <BsGiftFill />
        <span className="text-xl">☰</span>
      </div>
    </div>
  );
}
