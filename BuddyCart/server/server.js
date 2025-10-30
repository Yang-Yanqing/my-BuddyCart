require('dotenv').config();



const {Server}=require("socket.io")
const http=require("http")
const app = require("./app");
const {seedIfEmpty}=require("./db/seed");

const server=http.createServer(app);
const allowedOrigins = [
   "http://localhost:3000",
   "https://buddycart-client.netlify.app"
 ];

const io=new Server(server, {
   cors:{
     origin:allowedOrigins,
     credentials:true,
     methods:["GET", "POST"]
   },
   path: "/socket.io"
 });
require('./middleware/chatNameSpace')(io)
// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5005;
 const HOST = process.env.HOST || '0.0.0.0'; 
 console.log(`Server listening on ${HOST}:${PORT}`);



server.listen(PORT,HOST,async () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
  if (process.env.SEED_ON_START === "true") {
    try {
      const inserted = await seedIfEmpty();
      if (inserted) {
        console.log(`[seed] inserted ${inserted} demo products`);
      } else {
        console.log("[seed] skipped (already have products)");
      }
    } catch (e) {
      console.error("[seed] failed:", e?.message);
    }
  }
});
module.exports = {server, io, app};