import React, { useState } from "react";

const PrivateChat = ({ socket, username, currentPrivateChat, history }) => {
  const [message, setMessage] = useState("");

  const sendMessage = e => {
    e.preventDefault();
    socket.emit("sendPrivateMessage", {
      to: currentPrivateChat.id,
      username: username,
      message
    });
  };

  return (
    <div className="private-chat">
      <div className="private-chat__title">{currentPrivateChat.username}</div>
      <div className="private-chat__chat-window">
        {history ? history.messages.map(message => <div>{message}</div>) : null}
      </div>
      <form className="private-chat__input-field">
        <input
          placeholder="Enter a message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </form>
    </div>
  );
};

export default PrivateChat;
