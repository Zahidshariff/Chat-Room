const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store users
let users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("message", `${username} joined the chat`);
  });

  socket.on("sendMessage", (msg) => {
    io.emit("message", `${users[socket.id]}: ${msg}`);
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      io.emit("message", `${users[socket.id]} left`);
      delete users[socket.id];
    }
  });
}); // ✅ THIS WAS MISSING

server.listen(5000, () => {
  console.log("Server running on port 5000");
});