import { io } from "socket.io-client";
import { SOCKET_URL, SOCKET_PATH } from "../config/api";

export function createChatSocket({ token, user, roomId }) {
  const socket = io(`${SOCKET_URL}/chat`, {
    path: SOCKET_PATH,
    transports: ["websocket", "polling"], 
    query: { roomId: roomId || "lobby" },
    auth: { token },
    extraHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });

  socket.on("connect", () => console.log("✅ Chat connected:", socket.id));
  socket.on("connect_error", (err) => console.error("connect_error", err?.message || err));
  return socket;
}