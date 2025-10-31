import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createChatSocket } from "../utils/createChatSocket";


import ChatInput from "../components/ChatInput";
import ChatMessages from "../components/ChatMessages";
import ShowcasePanel from "../components/ShowcasePanel";

const ChatPage = ({ selectedProduct = null, shareTick = 0 }) => {
  const { roomId: roomParam } = useParams();
  const roomId = roomParam || "lobby";

  const { user, token, isAuthenticated, logOut } = useAuth();

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [myItem, setMyItem] = useState(null);
  const [peerItem, setPeerItem] = useState(null);
  const [copied, setCopied] = useState(false);

  const socketRef = useRef(null);


  const socket = useMemo(() => {
    if (!isAuthenticated) return null;
    return createChatSocket({
      baseURL: process.env.REACT_APP_SOCKET_URL || window.location.origin,
      token,
      user,
      roomId,
    });
  }, [isAuthenticated, token, user, roomId]);


  useEffect(() => {
    if (!socket) {
      setConnected(false);
      setMessages([]);
      setMyItem(null);
      setPeerItem(null);
      return;
    }

    socketRef.current = socket;

    const onConnect = () => {
      setConnected(true);
      socket.emit("join_room", { roomId });
    };
    const onDisconnect = () => setConnected(false);
    const onConnectError = (err) => {
      console.error("connect_error", err?.message || err);
      if (String(err?.message || "").includes("401")) logOut?.();
    };
    const onRoomState = (s) => {
      if (s?.recentMessages) setMessages(s.recentMessages);
      if (s?.showcase) {
        setMyItem(s.showcase.mine || null);
        setPeerItem(s.showcase.peer || null);
      }
    };
    const onMessage = (m) =>
      setMessages((prev) => [...prev, m].slice(-300));
    const onChatError = (e) => console.error("chat:error", e);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("room_state", onRoomState);
    socket.on("message", onMessage);
    socket.on("chat:error", onChatError);

    return () => {
      try {
        socket.emit("leave_room", { roomId });
      } catch {}
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("room_state", onRoomState);
      socket.off("message", onMessage);
      socket.off("chat:error", onChatError);
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [socket, roomId, logOut]);


  useEffect(() => {
    if (!selectedProduct || !connected || !socketRef.current) return;
    socketRef.current.emit("showcase:set", { item: selectedProduct });
  }, [selectedProduct, shareTick, connected]);

  useEffect(() => {
    const handler = (e) => {
      const item = e.detail;
      if (item && socketRef.current) {
        socketRef.current.emit("showcase:set", { item });
      } else {
        alert("Chat not connected yet — open chat first!");
      }
    };
    window.addEventListener("share-to-showcase", handler);
    return () => window.removeEventListener("share-to-showcase", handler);
  }, []);


  const onSend = (text) => {
    const t = (text || "").trim();
    if (!t || !connected || !socketRef.current) return;
    socketRef.current.emit("send_message", {
      roomId,
      type: "chat",
      text: t,
      tempId: `tmp_${Date.now()}`,
    });
  };

  const shareToShowcase = (item) =>
    socketRef.current?.emit("showcase:set", { item });
  const clearMine = () =>
    socketRef.current?.emit("showcase:clear", { owner: "mine" });
  const clearPeer = () =>
    socketRef.current?.emit("showcase:clear", { owner: "peer" });
  const rate = (target, ratingKey) =>
    socketRef.current?.emit("showcase:rate", { target, rating: ratingKey });

  const currentUserId = user?.id || user?._id || null;


  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      window.prompt("Copy room code:", roomId);
    }
  };

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 16px" }}>
      <div
        className="card"
        style={{
          marginBottom: 12,
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 10,
          background: "#fff",
        }}
      >
        <div style={{ lineHeight: 1.3 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Current room</div>
          <div style={{ fontWeight: 600 }}>{roomId}</div>
        </div>
        <span
          style={{
            marginLeft: 12,
            fontSize: 12,
            padding: "2px 8px",
            borderRadius: 999,
            background: connected ? "#e8fff2" : "#fff1f0",
            color: connected ? "#137a32" : "#a61d24",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {connected ? "connected" : "disconnected"}
        </span>
        <button className="btn" style={{ marginLeft: "auto" }} onClick={copyRoomCode}>
          {copied ? "Copied" : "Copy roomId"}
        </button>
      </div>

      {!isAuthenticated ? (
        <p style={{ opacity: 0.8 }}>Please log in before starting to chat.</p>
      ) : null}

      <div className="chatArea">
        <ChatMessages messages={messages} currentUserId={currentUserId} />
        <div style={{ height: 8 }} />
        <ChatInput onSend={onSend} disabled={!connected || !isAuthenticated} maxLen={500} />

        {!connected && isAuthenticated && (
          <p style={{ opacity: 0.7, marginTop: 6 }}>Connecting to the chat service…</p>
        )}

        <div style={{ height: 10 }} />

        <ShowcasePanel
          meName="me"
          peerName="peer"
          myItem={myItem}
          peerItem={peerItem}
          onClearMine={clearMine}
          onClearPeer={clearPeer}
          onRate={rate}
          onShare={shareToShowcase}
        />
      </div>
    </main>
  );
};

export default ChatPage;
