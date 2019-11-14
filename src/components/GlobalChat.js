import React, { useState, useEffect } from "react";
import { navigate } from "hookrouter/dist/router";
import socket from "../socket";
import OnlineUsers from "./OnlineUsers";
import PrivateChat from "./PrivateChat";
import Chat from "./views/Chat";
import uuidv4 from "uuid/v4";

const GlobalChat = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, updateMessages] = useState([]);
  const [statusMessage, updateStatusMessage] = useState([]);
  const [onlineUsers, updateOnlineUsers] = useState([]);
  const [currentPrivateChat, setCurrentPrivateChat] = useState({});
  const [privateHistory, updatePrivateHistory] = useState([]);

  useEffect(() => {
    const name = sessionStorage.getItem("username");
    setUsername(name);
    socket.emit("enterChat", { username: name });
  }, []);

  //chat update
  const updateChat = data => {
    console.log("updating chat", data);
    updateMessages([...messages, data]);
  };
  //status update
  const updateStatus = data => {
    console.log("status update", data);
    updateStatusMessage(data.message);
    setTimeout(() => {
      updateStatusMessage("");
    }, 2000);
  };
  //users update
  const updateUsers = data => {
    console.log("updating users", data);
    updateOnlineUsers(data.users.filter(user => user.id !== socket.id));
  };
  //receiving private messages
  const receivePrivate = data => {
    const { messages, id, username } = data;

    // checking if user is already in the history array
    const index = privateHistory.findIndex(x => x.username == username);
    if (index === -1) {
      updatePrivateHistory([...privateHistory, data]);
    } else {
      const newHistory = [...privateHistory];
      newHistory[index].messages.push(...messages);
      updatePrivateHistory(newHistory);
    }
  };
  const test = () => {
    console.log(privateHistory);
  };

  useEffect(() => {
    socket.on("updateChat", updateChat);
    socket.on("updateStatus", updateStatus);
    socket.on("updateUsers", updateUsers);
    socket.on("receivePrivateMessage", receivePrivate);

    return () => {
      socket.off("updateChat", updateChat);
      socket.off("updateStatus", updateStatus);
      socket.off("updateUsers", updateUsers);
      socket.off("receivePrivateMessage", receivePrivate);
    };
  }, [messages, statusMessage, onlineUsers, privateHistory]);

  const exitChat = () => {
    socket.emit("disconnect", {
      username
    });
    // socket.disconnect();
    sessionStorage.removeItem("username");
    navigate("/");
  };
  const sendMessage = e => {
    e.preventDefault();
    const data = `${username}: ${message}`;
    updateMessages([...messages, data]);
    socket.emit("message", { data });
  };

  // private messaging
  const startPrivateChat = user => {
    setCurrentPrivateChat(user);
  };

  const type = e => {
    setMessage(e.target.value);
    socket.emit("typing", { username });
  };

  return (
    <div>
      <button onClick={test}>test</button>
      <button onClick={exitChat}>Exit</button>
      <OnlineUsers users={onlineUsers} startPrivateChat={startPrivateChat} />
      <Chat
        username={username}
        message={message}
        messages={messages}
        statusMessage={statusMessage}
        type={type}
        sendMessage={sendMessage}
        onlineUsers={onlineUsers}
      />
      <PrivateChat
        socket={socket}
        username={username}
        currentPrivateChat={currentPrivateChat}
      />
    </div>
  );
};

export default GlobalChat;
