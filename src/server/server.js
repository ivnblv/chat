const express = require("express");
const socket = require("socket.io");
const users = require("./Users");

const app = express();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
const io = socket(server);

const onlineList = users => {
  if (users.length > 0) {
    return users.map(user => user.username);
  }
};

io.on("connection", socket => {
  console.log(`Socket ${socket.id} connected`);
  socket.on("enterChat", data => {
    if (users.length > 0) {
      io.to(`${socket.id}`).emit("updateUsers", {
        users: onlineList(users)
      });
    }
    if (data.username) {
      const user = { username: data.username, id: socket.id };
      users.push(user);
    }
    socket.broadcast.emit("updateStatus", {
      message: `${data.username} has joined the chat`
    });
    socket.broadcast.emit("updateUsers", {
      users: onlineList(users)
    });

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
  socket.on("disconnect", () => {
    const leavingUser = users.find(user => user.id === socket.id);
    if (users.length > 0 && leavingUser.username) {
      socket.broadcast.emit("updateStatus", {
        message: `${leavingUser.username} has left the chat`
      });
    }
    users.splice(users.indexOf(leavingUser), 1);
    socket.broadcast.emit("updateUsers", {
      users: onlineList(users)
    });
  });
});
