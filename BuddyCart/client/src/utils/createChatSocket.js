
import { io } from "socket.io-client";
import { SOCKET_URL, SOCKET_PATH } from "../config/api";


export function createChatSocket({ baseURL, token, user, roomId = "lobby" } = {}) {
 
  const origin = (baseURL || SOCKET_URL || window.location.origin).replace(/\/+$/, "");
 
  const url = `${origin}/chat`;

  const socket = io(url, {
    
    path: SOCKET_PATH || "/socket.io",
    transports: ["websocket", "polling"],

  
    auth: {
      token: token || localStorage.getItem("token") || "",
      name: user?.name || "",
      avatar: user?.profileImage || "",
    },

    
    query: { roomId },

   
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
    withCredentials: false,
  });

  socket.on("connect", () => {
    try {
      socket.emit("join_room", { roomId });
    } catch (_) {
      
    }
  });

  socket.on("connect_error", (err) => {
    
    console.error("connect_error:", err?.message || err);
  });

  return socket;
}

export default createChatSocket;
