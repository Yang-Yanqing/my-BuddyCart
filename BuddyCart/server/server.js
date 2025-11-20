require("./config/env");

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const { seedIfEmpty } = require("./db/seed");
const { connectDB }=require("./config/db");

const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://buddycart.fly.dev",
  "https://buddycart-client.netlify.app",
];

const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  },
});

require("./middleware/chatNameSpace")(io);

const PORT = process.env.PORT || 5005;
const HOST = process.env.HOST || "0.0.0.0";

(async()=>{
  
 try {
    await connectDB();
    
  server.listen(PORT, HOST, async () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
  if (process.env.SEED_ON_START === "true") {
    try {
      const inserted = await seedIfEmpty();
      console.log(inserted ? `[seed] inserted ${inserted} demo products` : "[seed] skipped (already have products)");
    } catch (e) {
      console.error("[seed] failed:", e?.message);
    }
  }
});
}
catch(err){
  console.error("Failed to start server:", err);
  process.exit(1);
}
})();



module.exports = { server, io, app };
