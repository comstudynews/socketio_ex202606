const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log(`connected: ${socket.id}`);

  socket.broadcast.emit("system:message", "A user joined the room.");

  socket.on("chat:message", (message) => {
    const text = String(message || "").trim();

    if (!text) {
      return;
    }

    io.emit("chat:message", {
      id: socket.id,
      text,
      sentAt: new Date().toISOString()
    });
  });

  socket.on("disconnect", () => {
    console.log(`disconnected: ${socket.id}`);
    socket.broadcast.emit("system:message", "A user left the room.");
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO server running at http://localhost:${PORT}`);
});
