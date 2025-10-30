require('dotenv').config();

const {Server}=require("socket.io")
const http=require("http")
const app = require("./app");

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




server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
module.exports = {server, io, app};