import React, { useState, useEffect } from "react";
import { navigate } from "hookrouter/dist/router";

const GlobalChat = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, updateMessages] = useState([]);

  useEffect(() => {
    setUsername(sessionStorage.getItem("username"));
  }, []);

  const exitChat = () => {
    sessionStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div>
      <button onClick={exitChat}>Exit</button>
      <div className="global-chat">
        <div className="global-chat__chat-window">
          {messages.map(message => (
            <div className="global-chat__message">{message}</div>
          ))}
        </div>
        <form className="global-chat__chat-input-field">
          <input
            className="global-chat__message-input"
            type="text"
            placeholder="Enter a message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <button className="global-chat__send-btn">Send</button>
        </form>
      </div>
    </div>
  );
};

export default GlobalChat;
