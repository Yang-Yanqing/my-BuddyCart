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
      socket.data.user = {
        userId: userLoad.id,
        role: userLoad.role,
        name: socket.handshake.auth?.name || userLoad.name || "User",
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
      socket.join(roomId || "lobby");
      console.log(`[chat] ${socket.id} joined room ${roomId || "lobby"}`);
    });


    socket.on("send_message", (msg) => {
      const room = msg?.roomId || "lobby";
      const payload = {
        id: `srv_${Date.now()}`,
        type: msg.type || "chat",
        text: msg.text,
        sender: {
          id: socket.data.user.userId,
          name: socket.data.user.name,
        },
        createdAt: Date.now(),
      };
    
      chatNS.to(room).emit("message", payload);
    });

    
  socket.on("showcase:set", ({ item }) => {
      if (!item) return;
      const room = socket.handshake.query?.roomId || "lobby";
      chatNS.to(room).emit("showcase_state", {
        mine: item,
        peer: null,
      });
      console.log(`[chat] showcase:set -> room ${room}`);
   });

  socket.on("showcase:rate", ({ target, rating }) => {
  if (!target) return;
  const room = socket.handshake.query?.roomId || "lobby";
  chatNS.to(room).emit("message", {
    id: `rate_${Date.now()}`,
    type: "info",
    text: `${socket.data.user.name} rated ${target.title || "an item"} ${rating}`,
    createdAt: Date.now(),
  });
});

    
    socket.on("showcase:clear", ({ owner }) => {
      const room = socket.handshake.query?.roomId || "lobby";
      chatNS.to(room).emit("showcase_state", {
        mine: owner === "mine" ? null : undefined,
        peer: owner === "peer" ? null : undefined,
      });
    });

    socket.on("disconnect", () => {
      console.log("[chat] disconnected", socket.id);
    });
  });
};
