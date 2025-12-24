"use client";

import Image from "next/image";
import { HiMenuAlt2, HiGlobeAlt, HiSearch } from "react-icons/hi";
import { HiSignal } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JoinedPage() {
  const router = useRouter(); // ✅ FIXED (inside component)

  return (
    <div className="max-w-[420px] mx-auto min-h-screen bg-white pb-20">
      {/* TOP NAV */}
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <HiMenuAlt2 className="text-2xl text-teal-500" />

        <div className="flex gap-6 text-gray-400">
          <span>Explore</span>
          <span>Home</span>
          <span className="text-black font-semibold relative">
            Joined
            <span className="absolute left-1/2 -bottom-2 w-6 h-[2px] bg-teal-500 -translate-x-1/2"></span>
          </span>
        </div>

        <div className="flex gap-3 text-xl">
          <HiGlobeAlt />
          <HiSearch />
        </div>
      </header>

      {/* CREATE ROOM CARD */}
      <div className="relative mx-4 mt-6 bg-gray-50 rounded-2xl p-4 shadow-sm">
        <span className="absolute -top-3 left-4 bg-teal-400 text-white text-xs px-3 py-1 rounded-full">
          Mine
        </span>

        <Link href="/createRoom">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="rounded-full"
            />

            <button>
              <h3 className="font-semibold text-base">Create My Room</h3>
              <p className="text-sm text-gray-400">
                Share everything with friends
              </p>
            </button>

            <button className="ml-auto w-10 h-10 rounded-full bg-green-500 text-white text-2xl flex items-center justify-center">
              +
            </button>
          </div>
        </Link>
      </div>

      {/* JOINED TITLE */}
      <h2 className="mt-8 px-4 text-lg font-semibold">Joined</h2>

      {/* JOINED ROOM */}
      <div className="flex items-center gap-4 px-4 py-6">
        <Image
          src="/logo.png"
          alt="Room"
          width={48}
          height={48}
          className="rounded-full"
        />

        <div className="flex-1">
          <h3 className="font-semibold text-sm">Dil Help | दिल समर्थन</h3>

          <div className="flex items-center gap-2 mt-1">
            <span className="bg-yellow-100 text-xs px-2 py-0.5 rounded-lg">
              Chat
            </span>
            <span>🇮🇳</span>
          </div>

          <p className="text-xs text-gray-400 mt-1">Welcome Everyone ❤️</p>
        </div>

        <div className="flex items-center gap-1 text-sm">
          <span>3495</span>
          <HiSignal className="text-green-500" />
        </div>
      </div>

      {/* BOTTOM NAV */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white border-t py-3">
        <div className="flex justify-around text-xl text-gray-400">
          <span className="text-green-500">🏠</span>
          <span>🤍</span>
          <span>💬</span>
          <span>👤</span>
        </div>
      </footer>
    </div>
  );
}
