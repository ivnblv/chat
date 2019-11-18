import React, { useState, useEffect } from "react";
import { navigate } from "hookrouter/dist/router";
import socket from "../../socket";
import ChatHeader from "../ChatHeader/ChatHeader";
import OnlineUsers from "../OnlineUsers/OnlineUsers";
import PrivateChat from "../PrivateChat/PrivateChat";
import Chat from "../Chat/Chat";

const GlobalChat = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, updateMessages] = useState([]);
  const [statusMessage, updateStatusMessage] = useState([]);
  const [onlineUsers, updateOnlineUsers] = useState([]);
  const [currentPrivateChat, setCurrentPrivateChat] = useState({});
  const [privateHistory, updatePrivateHistory] = useState([]);
  const [unreadMessages, updateUnreadMessages] = useState([]);

  useEffect(() => {
    const name = sessionStorage.getItem("username");
    setUsername(name);
    socket.emit("enterChat", { username: name });
  }, []);

  //chat update
  const updateChat = data => {
    console.log("updating chat", data);
    updateMessages([...messages, data]);
    document
      .getElementById("messages")
      .lastChild.scrollIntoView(false, "smooth");
  };
  //status message update
  const updateStatus = data => {
    console.log("status update", data);
    updateStatusMessage(data.message);
    setTimeout(() => {
      updateStatusMessage("");
    }, 2500);
  };
  //users update
  const updateUsers = data => {
    console.log("updating users", data);
    updateOnlineUsers(data.users.filter(user => user.id !== socket.id));
  };
  //receiving private messages
  const receivePrivate = ({ id, username, messages, updateUnread }) => {
    // adding user to unread array if conditions are matched
    if (
      currentPrivateChat.id !== id &&
      updateUnread &&
      !unreadMessages.includes(id)
    ) {
      updateUnreadMessages([...unreadMessages, id]);
    }
    // checking if user is already in the history array
    const index = privateHistory.findIndex(x => x.id == id);
    if (index === -1) {
      updatePrivateHistory([...privateHistory, { id, username, messages }]);
    } else {
      const newHistory = [...privateHistory];
      if (newHistory[index].messages.length === 40) {
        newHistory[index].messages.shift();
      }
      newHistory[index].messages.push(...messages);
      updatePrivateHistory(newHistory);
    }
  };

  const setRead = id => {
    const index = unreadMessages.indexOf(id);
    if (index !== -1) {
      const newUnreadMessages = [...unreadMessages];
      newUnreadMessages.splice(index, 1);
      updateUnreadMessages(newUnreadMessages);
    }
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
    socket.emit("leaveChat", {
      username
    });
    sessionStorage.removeItem("username");
    navigate("/");
  };
  const sendMessage = e => {
    e.preventDefault();
    socket.emit("message", { username, message });
  };

  // private messaging
  const startPrivateChat = user => {
    setCurrentPrivateChat(user);
  };
  const closePrivateChat = () => {
    setCurrentPrivateChat({});
  };
  const type = e => {
    setMessage(e.target.value);
    socket.emit("typing", { username });
  };

  return (
    <div className="main">
      <ChatHeader username={username} exitChat={exitChat} />
      <Chat
        username={username}
        message={message}
        messages={messages}
        statusMessage={statusMessage}
        type={type}
        sendMessage={sendMessage}
        onlineUsers={onlineUsers}
        startPrivateChat={startPrivateChat}
      />
      <OnlineUsers users={onlineUsers} startPrivateChat={startPrivateChat} />
      {currentPrivateChat.id ? (
        <PrivateChat
          socket={socket}
          username={username}
          currentPrivateChat={currentPrivateChat}
          closePrivateChat={closePrivateChat}
          history={privateHistory.find(
            history => history.id === currentPrivateChat.id
          )}
          updatePrivateHistory={updatePrivateHistory}
          setRead={setRead}
        />
      ) : null}
    </div>
  );
};

export default GlobalChat;
