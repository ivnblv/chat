import React from "react";

const ChatMessage = ({ message }) => {
  return (
    <div className="chat-message">
      <span className="chat-message__username">{message.username}:</span>
      {message.message}
    </div>
  );
};
export default ChatMessage;
