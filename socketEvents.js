const io = require("./server").io;

const users = [];
const messages = [];

const socketEvents = socket => {
  socket.on("loginAttempt", username => {
    if (users.findIndex(user => user.username === username) !== -1) {
      io.to(`${socket.id}`).emit(
        "loginFailure",
        `Username ${username} is currently taken`
      );
    } else io.to(`${socket.id}`).emit("loginSuccess", username);
  });
  socket.on("enterChat", ({ username }) => {
    const user = { username, id: socket.id };
    users.push(user);
    socket.broadcast.emit("updateStatus", {
      message: `${username} joined the chat`
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
  socket.on("sendPrivateMessage", ({ receivingUser, message, username }) => {
    const receiver = users.find(user => user.username === receivingUser);
    if (receiver) {
      io.to(`${receiver.id}`).emit("receivePrivateMessage", {
        messages: [{ username, message }],
        id: socket.id,
        username,
        updateUnread: true
      });
      io.to(`${socket.id}`).emit("receivePrivateMessage", {
        messages: [{ username, message }],
        id: receiver.id,
        username,
        updateUnread: false
      });
    } else {
      io.to(`${socket.id}`).emit("privateMessageError", {
        errorMessage: `${receivingUser} is offline`
      });
    }
  });
  socket.on("leaveChat", () => {
    const leavingUser = users.find(user => user.id === socket.id);
    if (leavingUser !== undefined) {
      if (leavingUser.username !== undefined) {
        socket.broadcast.emit("updateStatus", {
          message: `${leavingUser.username} left the chat`
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
          message: `${leavingUser.username} left the chat`
        });
      }
      users.splice(users.indexOf(leavingUser), 1);
      socket.broadcast.emit("updateUsers", {
        users
      });
    }
  });
};
module.exports = socketEvents;
