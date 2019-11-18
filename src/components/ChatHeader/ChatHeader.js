import React from "react";

const ChatHeader = ({ username }) => {
  return (
    <div className="chat-header">
      <h2 className="chat-header__logo">Chat</h2>
      <h3 className="chat-header__username">{username}</h3>
      <button className="btn chat-header__exit-btn">Exit</button>
    </div>
  );
};

export default ChatHeader;
