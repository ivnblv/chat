import React from "react";
import StatusBar from "../StatusBar/StatusBar";

const Chat = ({ message, type, messages, statusMessage, sendMessage }) => {
  return (
    <div>
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

export default Chat;
