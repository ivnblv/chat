const express = require("express");
const socket = require("socket.io");
const users = require("./Users");

const app = express();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
const io = socket(server);

io.on("connection", socket => {
  socket.on("enterChat", data => {
    users.push({ username: data.username, id: socket.id });
    // io.to(`${socket.id}`).emit("updateChat", messages);
  });
  socket.on("message", data => {
    socket.broadcast.emit("updateChat", data.data);
  });
});
