const { verifyAccessToken } = require("../middleware/jwt");

module.exports = (io) => {
  const chatNS = io.of("/chat");


  chatNS.use((socket, next) => {
    try {
      let token = socket.handshake.auth?.token;
      
      if (!token) {
        const auth = socket.handshake.headers?.authorization || "";
        if (auth.startsWith("Bearer ")) token = auth.slice("Bearer ".length);
      }
      if (!token) return next(new Error("Unauthorized: no token"));
      const userLoad = verifyAccessToken(token);
      const authName = socket.handshake.auth?.name;
      const authAvatar = socket.handshake.auth?.avatar;
       socket.data.user = {
        userId: userLoad.id,
        role: userLoad.role,
        name: authName || userLoad.name || (userLoad.email && userLoad.email.split?.("@")?.[0]) || "User",
        avatar: authAvatar || userLoad.profileImage || null,
      };
    
      next();
    } catch (err) {
      console.error("chat auth error:", err.message);
      next(new Error("Unauthorized"));
    }
  });

 
  chatNS.on("connection", (socket) => {
    console.log("[chat] connected", socket.data.user.userId, socket.id);


    socket.on("join_room", ({ roomId }) => {
      const room = roomId || socket.handshake.query?.roomId||"lobby";
      socket.join(room);
      console.log(`[chat] ${socket.id} joined room ${room}`);
    });


    socket.on("send_message", (msg) => {
      const room = msg?.roomId || "lobby";
      const payload = {
        id: `srv_${Date.now()}`,
        type: msg.type || "chat",
        text: msg.text,
        sender: {
          userId:socket.data.user.userId,
          id:socket.data.user.userId,
          avatar:socket.data.user.avatar||null,
        },
         ts: Date.now(),
      };
    
      chatNS.to(room).emit("message", payload);
    });

    
  socket.on("showcase:set", ({ item }) => {
      if (!item) return;
      const room = socket.handshake.query?.roomId || "lobby";
      socket.emit("showcase_state", {mine:item,peer:null });
      socket.to(room).emit("showcase_state", { mine: null, peer: item });

      console.log(`[chat] showcase:set -> room ${room}`);
   });

  socket.on("showcase:rate", ({ target, rating }) => {
  if (!target) return;
  const room = socket.handshake.query?.roomId || "lobby";
  chatNS.to(room).emit("message", {
    id:`rate_${Date.now()}`,
    type:"info",
    text:`${socket.data.user.name} rated ${target.title||"an item"} ${rating}`,
    user:{
     userId:socket.data.user.userId,
     name:socket.data.user.name,
     avatar:socket.data.user.avatar || null,
   },
   ts:Date.now(),
  });
});

    
    socket.on("showcase:clear", ({ owner }) => {
      const room = socket.handshake.query?.roomId || "lobby";
      if (owner === "mine") {
  socket.emit("showcase_state", { mine: null });      
   socket.to(room).emit("showcase_state", { peer: null }); 
 } else if (owner === "peer") {
  
  socket.emit("showcase_state", { peer: null });
   socket.to(room).emit("showcase_state", { mine: null });
 }
});
    socket.on("disconnect", () => {
      console.log("[chat] disconnected", socket.id);
    });
  });
};
