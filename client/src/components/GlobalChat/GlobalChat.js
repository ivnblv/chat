import React, { useState, useEffect } from "react";
import { navigate } from "hookrouter/dist/router";
import ChatHeader from "../ChatHeader/ChatHeader";
import OnlineUsers from "../OnlineUsers/OnlineUsers";
import PrivateChat from "../PrivateChat/PrivateChat";
import Chat from "../Chat/Chat";
import socket from "../../socket";

const GlobalChat = () => {
  const [username, setUsername] = useState("");
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
    socket.on("updateUsers", updateUsers);
    socket.on("receivePrivateMessage", receivePrivate);
    return () => {
      socket.removeAllListeners("updateUsers");
      socket.removeAllListeners("receivePrivateMessage");
    };
  }, [onlineUsers, privateHistory, currentPrivateChat]);

  useEffect(() => {
    if (currentPrivateChat.id) {
      setRead(currentPrivateChat.id);
      setDisplayUsers(false);
    }
  }, [currentPrivateChat]);

  //users update
  const updateUsers = ({ users }) => {
    updateOnlineUsers(users.filter(user => user.id !== socket.id));
    const lastUser = [...users].pop();
    // in case there's an open private chat with reconnecting user
    if (lastUser.username === currentPrivateChat.username) {
      setCurrentPrivateChat(lastUser);
      const index = privateHistory.findIndex(
        user => user.id === currentPrivateChat.id
      );
      if (index !== -1) {
        const newHistory = [...privateHistory];
        newHistory[index].id = lastUser.id;
        updatePrivateHistory(newHistory);
      }
    }
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
  // private messaging
  const startPrivateChat = (e, user) => {
    e.preventDefault();
    setCurrentPrivateChat(user);
  };
  const closePrivateChat = e => {
    e.preventDefault();
    setCurrentPrivateChat({});
  };
  const setUserListDisplay = () => {
    setDisplayUsers(!displayUsers);
  };
  // autoscroll + autoscroll prevention if user scrolled up
  const autoScroll = (scrollbar, messages, message) => {
    const scrollTop = scrollbar.current.getValues().scrollTop;
    const clientHeight = scrollbar.current.getValues().clientHeight;
    const messagesHeight = document
      .querySelector(messages)
      .getBoundingClientRect().height;
    const messageHeight = document
      .querySelector(message)
      .getBoundingClientRect().height;
    if (messagesHeight - scrollTop - clientHeight < messageHeight + 1) {
      scrollbar.current.scrollToBottom();
    }
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
        socket={socket}
        onlineUsers={onlineUsers}
        startPrivateChat={startPrivateChat}
        autoScroll={autoScroll}
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
          setCurrentPrivateChat={setCurrentPrivateChat}
          onlineUsers={onlineUsers}
          closePrivateChat={closePrivateChat}
          autoScroll={autoScroll}
          history={
            privateHistory.find(
              history => history.id === currentPrivateChat.id
            ) || { messages: [] }
          }
        />
      ) : null}
    </div>
  );
};

export default GlobalChat;
