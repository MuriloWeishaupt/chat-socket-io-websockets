import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io"
import { createServer } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;



app.use(express.static(join(__dirname, "public"))); 

let socketsConnected = new Set()

io.on("connection", onConnected)

function onConnected(socket) {
  console.log(socket.id)
  socketsConnected.add(socket.id)

  io.emit("clients-total", socketsConnected.size)

  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id)
    socketsConnected.delete(socket.id)
    io.emit("clients-total", socketsConnected.size)
  })
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
