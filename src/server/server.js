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
  console.log(`Socket ${socket.id} connected`);
  socket.on("enterChat", data => {
    const user = { username: data.username, id: socket.id };
    users.push(user);
    socket.broadcast.emit("updateStatus", {
      message: `${data.username} has joined the chat`
    });
    io.emit("updateUsers", {
      users
    });
    // io.to(`${socket.id}`).emit("upadteUsers", {
    //   users
    // });
    // io.to(`${socket.id}`).emit("updateChat", messages);
  });
  socket.on("typing", data => {
    socket.broadcast.emit("updateStatus", {
      message: `${data.username} is typing...`
    });
  });
  socket.on("message", data => {
    socket.broadcast.emit("updateChat", data.data);
  });

  // private message
  socket.on("sendPrivateMessage", data => {
    console.log("sending private");
    io.to(`${data.to}`).emit("receivePrivateMessage", {
      messages: [data.message],
      id: socket.id,
      username: data.username
    });
  });

  socket.on("leaveChat", () => {
    const leavingUser = users.find(user => user.id === socket.id);
    // socket.broadcast.emit("updateStatus", {
    //   message: `${leavingUser.username} has left the chat`
    // });
    users.splice(users.indexOf(leavingUser), 1);
    socket.broadcast.emit("updateUsers", {
      users
    });
  });

  socket.on("disconnect", () => {
    console.log(`socket ${socket.id} disconnected`);
    const leavingUser = users.find(user => user.id === socket.id);
    if (users.length > 0 && leavingUser.username) {
      socket.broadcast.emit("updateStatus", {
        message: `${leavingUser.username} has left the chat`
      });
    }
    users.splice(users.indexOf(leavingUser), 1);
    socket.broadcast.emit("updateUsers", {
      users
    });
  });
});
