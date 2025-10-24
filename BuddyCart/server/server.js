require('dotenv').config();

const {Server}=require("socket.io")
const http=require("http")
const app = require("./app");

const server=http.createServer(app);
const io=new Server(server,{
  cors:{origin:process.env.ORIGIN||process.env.CLIENT_BASE_URL,credentials:true}
})

require('./middleware/chatNameSpace')(io)
// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5005;



server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
module.exports = {server, io, app};