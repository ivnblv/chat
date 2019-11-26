import React, { useState, useEffect } from "react";
import { navigate } from "hookrouter/dist/router";
import ChatHeader from "../ChatHeader/ChatHeader";
import OnlineUsers from "../OnlineUsers/OnlineUsers";
import PrivateChat from "../PrivateChat/PrivateChat";
import Chat from "../Chat/Chat";
import io from "socket.io-client";
const socket = io("localhost:5000");

const GlobalChat = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, updateMessages] = useState([]);
  const [statusMessage, updateStatusMessage] = useState([]);
  const [onlineUsers, updateOnlineUsers] = useState([]);
  const [displayUsers, setDisplayUsers] = useState(false);
  const [currentPrivateChat, setCurrentPrivateChat] = useState({});
  const [privateHistory, updatePrivateHistory] = useState([]);
  const [unreadMessages, updateUnreadMessages] = useState([]);

  useEffect(() => {
    const name = sessionStorage.getItem("username");
    if (name === null) {
      navigate("/");
    } else {
      setUsername(name);
      socket.emit("enterChat", { username: name });
    }
    return () => {
      socket.emit("leaveChat", {
        username
      });
      sessionStorage.removeItem("username");
    };
  }, []);
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
  }, [
    messages,
    statusMessage,
    onlineUsers,
    privateHistory,
    currentPrivateChat
  ]);
  useEffect(() => {
    let timer;
    if (statusMessage !== "") {
      timer = setTimeout(() => {
        updateStatusMessage("");
      }, 2000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [statusMessage]);

  useEffect(() => {
    if (currentPrivateChat.id) {
      setRead(currentPrivateChat.id);
      setDisplayUsers(false);
    }
  }, [currentPrivateChat]);

  const updateChat = data => {
    updateMessages(data);
    if (messages.length > 0) {
      document
        .getElementById("messages")
        .lastChild.scrollIntoView(false, "smooth");
    }
  };
  //status message update
  const updateStatus = data => {
    updateStatusMessage(data.message);
  };
  //users update
  const updateUsers = data => {
    updateOnlineUsers(data.users.filter(user => user.id !== socket.id));
  };
  //receiving private messages
  const receivePrivate = ({ id, username, messages, updateUnread }) => {
    // adding user to unread array if conditions are matched
    if (
      updateUnread &&
      currentPrivateChat.id != id &&
      !unreadMessages.includes(id)
    ) {
      const newMessages = [...unreadMessages];
      newMessages.push(id);
      updateUnreadMessages(newMessages);
    }
    // checking if user is already in the history array and updating history array accordingly
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
  const isUnread = userId => {
    return unreadMessages.includes(userId) ? true : false;
  };
  const sendMessage = e => {
    e.preventDefault();
    if (message.length > 0) {
      socket.emit("message", { username, message });
      setMessage("");
    }
  };
  // private messaging
  const startPrivateChat = (e, user) => {
    e.preventDefault();
    setCurrentPrivateChat(user);
  };
  const closePrivateChat = e => {
    e.preventDefault();
    setCurrentPrivateChat({});
  };
  const type = e => {
    setMessage(e.target.value);
    socket.emit("typing", { username });
  };
  const setUserListDisplay = () => {
    setDisplayUsers(!displayUsers);
  };

  return (
    <div className="main">
      <ChatHeader
        username={username}
        setUserListDisplay={setUserListDisplay}
        unreadPresent={unreadMessages.length > 0 ? true : false}
      />
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
      <OnlineUsers
        users={onlineUsers}
        startPrivateChat={startPrivateChat}
        displayUsers={displayUsers}
        isUnread={isUnread}
        privateHistory={privateHistory}
      />
      {currentPrivateChat.id ? (
        <PrivateChat
          socket={socket}
          username={username}
          currentPrivateChat={currentPrivateChat}
          closePrivateChat={closePrivateChat}
          history={privateHistory.find(
            history => history.id === currentPrivateChat.id
          )}
        />
      ) : null}
    </div>
  );
};

export default GlobalChat;
