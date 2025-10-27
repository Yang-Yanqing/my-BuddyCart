const {verifyAccessToken}=require("../middleware/jwt");
const {rooms,ensureRoom,sanitize}=require("./state");
const crypto=require("node:crypto");

const attachChatNamespace=(io)=>{

    const chatNS=io.of("/chat");

chatNS.use((chatSocket,next)=>{
    try {
        let token=chatSocket.handshake.auth?.token;
        if(!token){
            const auth=chatSocket.handshake.headers?.authorization||"";
            if(auth.startsWith("Bearer "))token=auth.slice("Bearer ".length);
        }
        if(!token)token=chatSocket.handshake.query?.token;
        if(!token)return next(new Error("Unauthorized:no token"));

        const userLoad=verifyAccessToken(token);
        chatSocket.data.user={
          userId:userLoad.id,
          role:userLoad.role,
          name:userLoad.name||"User"
        }
        
        return next();
    } catch (err) {
        return next(new Error("Unauthorized: invalid token"));
    }
})

chatNS.on("connection",(chatSocket)=>{
    const u=chatSocket.data.user;
    console.log(`[chat] connected`,u?.userId,chatSocket.id);
    if (u?.userId)chatSocket.join(`user:${u.userId}`);
    chatSocket.broadcast.emit('chat:system', {
      type: 'user_online',
      userId: u.userId,
      name: u.name||"User",
      at: Date.now(),
    }
);

chatSocket.on("join_room", ({ roomId }) => {
  if (!roomId) return chatSocket.emit("error", { code: "VALIDATION_ERROR", message: "roomId is required" });
  const room = ensureRoom(roomId);
  if (room.members.size>=3) {
    return chatSocket.emit("error", { code: "ROOM_FULL", message: "Room is full(MAX:3)" });
  }
  chatSocket.join(roomId);
  room.addMember(chatSocket.id, chatSocket.data.user);
 chatSocket.emit("joined", { roomId, user: chatSocket.data.user });
 chatSocket.emit("room_state", {
    roomId,
    members: Array.from(room.members.values()),
    showcase: room.showcase,
    recentMessages: room.messages.toArray(),
  });
  chatSocket.to(roomId).emit("room_state", {
    roomId,
    members: Array.from(room.members.values()),
    showcase: room.showcase,
  });
});

chatSocket.on("send_message", ({ roomId, type, text, tempId }) => {
  if (!roomId || !text || !["chat", "comment"].includes(type)) {
    return chatSocket.emit("error", { code: "VALIDATION_ERROR", message: "Invalid parameters" });
  }
  const room = rooms.get(roomId);
  if (!room || !room.members.has(chatSocket.id)) {
    return chatSocket.emit("error", { code: "NOT_JOINED", message: "You have not joined this room" });
  }

  if (type === "comment" && !room.showcase) {
    return chatSocket.emit("error", { code: "NO_SHOWCASE", message: "Currently there are no products  displayed" });
  }
  const msg = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`, 
    type,
    text: sanitize(text),
    user: chatSocket.data.user,
    ts: Date.now(),
  };
  room.addMessage(msg);
  chatNS.to(roomId).emit("message", { ...msg, ackTempId: tempId });
});

chatSocket.on("set_showcase", ({ roomId, product }) => {
  if (!roomId || !product || !product.productId) {
    return chatSocket.emit("error", { code: "VALIDATION_ERROR", message: "Product is incomplete" });
  }

  const room = ensureRoom(roomId);
  if (!room.members.has(chatSocket.id)) {
    return chatSocket.emit("error", { code: "NOT_JOINED", message: "You have not joined this room" });
  }

  room.showcase = {
    productId: product.productId,
    title: product.title || "",
    price: product.price ?? null,
    image: product.image || "",
    pinnedBy: chatSocket.data.user,
    pinnedAt: Date.now(),
  };
  chatNS.to(roomId).emit("showcase_updated", {
    roomId,
    showcase: room.showcase,
    by: chatSocket.data.user,
  });
});
   chatSocket.on("disconnect", () => {
  for (const [roomId, room] of rooms) {
    if (room.members.has(chatSocket.id)) {
      room.removeMember(chatSocket.id);
      chatNS.to(roomId).emit("room_state", {
        roomId,
        members: Array.from(room.members.values()),
        showcase: room.showcase,
      });
      
      if (room.members.size === 0) {
        room.destroy();
        rooms.delete(roomId);
      }
    }
  }
});
  })
 
}



module.exports=attachChatNamespace;