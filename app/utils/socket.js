import { io } from "socket.io-client";

let socket = null;

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "https://chat-app-1-qvl9.onrender.com";

export const getSocket = (token) => {
  // ✅ Prevent SSR execution
  if (typeof window === "undefined") return null;

  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false,
      withCredentials: true,
      auth: token ? { token } : undefined,
    });
  }

  return socket;
};
