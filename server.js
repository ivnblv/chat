const express = require("express");
const socket = require("socket.io");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(express.static("client/dist"));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
// });

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
const io = socket(server);

const users = [];
const messages = [];

io.on("connection", socket => {
  socket.on("enterChat", ({ username }) => {
    const user = { username, id: socket.id };
    users.push(user);
    socket.broadcast.emit("updateStatus", {
      message: `${username} has joined the chat`
    });
    io.emit("updateUsers", {
      users
    });
    io.to(`${socket.id}`).emit("updateChat", messages);
  });
  socket.on("typing", ({ username }) => {
    socket.broadcast.emit("updateStatus", {
      message: `${username} is typing...`
    });
  });
  socket.on("message", data => {
    if (messages.length < 50) {
      messages.push(data);
    } else {
      messages.shift();
      messages.push(data);
    }
    io.emit("updateChat", messages);
  });

  socket.on("sendPrivateMessage", ({ to, message, username }) => {
    io.to(`${to}`).emit("receivePrivateMessage", {
      messages: [{ username, message }],
      id: socket.id,
      username,
      updateUnread: true
    });
    io.to(`${socket.id}`).emit("receivePrivateMessage", {
      messages: [{ username, message }],
      id: to,
      username,
      updateUnread: false
    });
  });

  socket.on("leaveChat", () => {
    const leavingUser = users.find(user => user.id === socket.id);
    if (leavingUser !== undefined) {
      if (leavingUser.username !== undefined) {
        socket.broadcast.emit("updateStatus", {
          message: `${leavingUser.username} has left the chat`
        });
      }
      users.splice(users.indexOf(leavingUser), 1);
      socket.broadcast.emit("updateUsers", {
        users
      });
    }
  });

  socket.on("disconnect", () => {
    const leavingUser = users.find(user => user.id === socket.id);
    if (leavingUser) {
      if (leavingUser.username !== undefined) {
        socket.broadcast.emit("updateStatus", {
          message: `${leavingUser.username} has left the chat`
        });
      }
      users.splice(users.indexOf(leavingUser), 1);
      socket.broadcast.emit("updateUsers", {
        users
      });
    }
  });
});
