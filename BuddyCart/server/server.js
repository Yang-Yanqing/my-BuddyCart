require('dotenv').config();

const {Server}=require("socket.io")
const http=require("http")
const app = require("./app");

const server=http.createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" },
  path: "/socket.io"
});
require('./middleware/chatNameSpace')(io)
// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5005;



server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
module.exports = {server, io, app};