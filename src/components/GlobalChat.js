import React, { useState, useEffect } from "react";
import { navigate } from "hookrouter/dist/router";
const socket = require("socket.io-client")("http://localhost:3000");
import StatusBar from "./StatusBar";

const GlobalChat = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, updateMessages] = useState([]);
  const [statusMessage, updateStatusMessage] = useState([]);

  useEffect(() => {
    setUsername(sessionStorage.getItem("username"));
    socket.emit("enterChat", { username });
  }, [username]);

  const exitChat = () => {
    sessionStorage.removeItem("username");
    navigate("/");
  };
  const sendMessage = e => {
    e.preventDefault();
    const data = `${username}: ${message}`;
    updateMessages([...messages, data]);
    socket.emit("message", { data });
  };
  socket.on("updateChat", data => {
    updateMessages([...messages, data]);
  });
  socket.on("updateStatus", data => {
    updateStatusMessage(data.message);
    setTimeout(() => {
      updateStatusMessage("");
    }, 2000);
  });

  const type = e => {
    setMessage(e.target.value);
    socket.emit("typing", { username });
  };

  return (
    <div>
      <button onClick={exitChat}>Exit</button>
      <div className="global-chat">
        <div className="global-chat__chat-window">
          {messages.map(message => (
            <div className="global-chat__message">{message}</div>
          ))}
          <StatusBar message={statusMessage} />
        </div>
        <form className="global-chat__chat-input-field">
          <input
            className="global-chat__message-input"
            type="text"
            placeholder="Enter a message..."
            value={message}
            onChange={e => type(e)}
          />
          <button className="global-chat__send-btn" onClick={sendMessage}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default GlobalChat;
