export const registerRoomEvents = (socket, setParticipants) => {
  if (!socket) return () => {};

  /* =========================
     ROOM USERS (INITIAL)
  ========================== */
  socket.off("room:users");
  socket.on("room:users", (users) => {
    setParticipants(users);
  });

  /* =========================
     USER JOIN
  ========================== */
  socket.off("room:userJoined");
  socket.on("room:userJoined", (user) => {
    setParticipants((prev) => {
      if (prev.some((u) => u.id === user.id)) return prev;
      return [...prev, user];
    });
  });

  /* =========================
     USER LEAVE
  ========================== */
  socket.off("room:userLeft");
  socket.on("room:userLeft", ({ userId }) => {
    setParticipants((prev) => prev.filter((u) => u.id !== userId));
  });

  /* =========================
     MIC STATUS
  ========================== */
  socket.off("mic:update");
  socket.on("mic:update", ({ userId, speaking, muted }) => {
    setParticipants((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, speaking, muted } : u
      )
    );
  });

  /* =========================
     HOST CONTROLS
  ========================== */
  socket.off("user:muted");
  socket.on("user:muted", ({ userId }) => {
    setParticipants((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, muted: true, speaking: false }
          : u
      )
    );
  });

  socket.off("user:kicked");
  socket.on("user:kicked", ({ userId }) => {
    setParticipants((prev) => prev.filter((u) => u.id !== userId));
  });

  /* =========================
     CHAT / TYPING / GIFTS
  ========================== */
  socket.off("message:receive");
  socket.on("message:receive", (msg) => {
    console.log("Message:", msg);
  });

  socket.off("typing:update");
  socket.on("typing:update", (data) => {
    console.log("Typing:", data);
  });

  socket.off("gift:received");
  socket.on("gift:received", (gift) => {
    console.log("Gift:", gift);
  });

  /* =========================
     WEBRTC SIGNALING
  ========================== */
  socket.off("call:incoming");
  socket.on("call:incoming", (data) => {
    console.log("Incoming call:", data);
  });

  socket.off("call:answered");
  socket.on("call:answered", (data) => {
    console.log("Call answered:", data);
  });

  socket.off("call:ice-candidate");
  socket.on("call:ice-candidate", (data) => {
    console.log("ICE candidate:", data);
  });

  /* =========================
     CLEANUP (CRITICAL)
  ========================== */
  return () => {
    socket.off();
  };
};
