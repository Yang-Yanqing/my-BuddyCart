import { io } from "socket.io-client";
import { SOCKET_URL, SOCKET_PATH } from "../config/api";

export function createChatSocket({ token, user, roomId }) {
  const nsURL = `${SOCKET_URL}/chat`; 

  const socket = io(nsURL, {
    path: SOCKET_PATH,               
    transports: ["websocket"],       
    query: { roomId: roomId || "lobby" },
    auth: {
      token,
      name: user?.name || user?.email?.split?.("@")?.[0] || "User",
      avatar: user?.profileImage || user?.avatar || null,
    },
    extraHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect_error", (err) => {
    console.error("connect_error", err?.message || err);
  });

  return socket;
}
