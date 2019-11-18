import React, { useState, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";

const PrivateChat = ({
  socket,
  username,
  currentPrivateChat,
  closePrivateChat,
  history
}) => {
  const [message, setMessage] = useState("");
  const sendMessage = e => {
    e.preventDefault();
    socket.emit("sendPrivateMessage", {
      to: currentPrivateChat.id,
      username: username,
      message
    });
  };
  useEffect(() => {
    const messages = document.getElementById("private-messages");
    if (messages && messages.lastChild) {
      console.log("effect");
      messages.lastChild.scrollIntoView();
    }
  });

  return (
    <div className="private-chat">
      <div className="private-chat__header">
        <div className="private-chat__title">{currentPrivateChat.username}</div>
        <button
          className="btn private-chat__close-btn"
          onClick={closePrivateChat}
        >
          X
        </button>
      </div>
      <Scrollbars
        className="private-chat__scroll"
        renderThumbVertical={props => (
          <div {...props} className="thumb-vertical" />
        )}
      >
        <div id="private-messages" className="private-chat__messages">
          {history
            ? history.messages.map(message => (
                <div
                  className={`private-chat__message ${
                    message.username === username
                      ? "private-chat__message--right"
                      : "private-chat__message--left"
                  }`}
                >
                  <p
                    className={`private-chat__message-text ${
                      message.username === username
                        ? "private-chat__message-text--right"
                        : "private-chat__message-text--left"
                    }`}
                  >
                    {message.message}
                  </p>
                  <p
                    className={`private-chat__username ${
                      message.username === username
                        ? "private-chat__username--right"
                        : "private-chat__username--left"
                    }`}
                  >
                    {message.username}
                  </p>
                </div>
              ))
            : null}
        </div>
      </Scrollbars>
      <form className="input-field">
        <input
          className="input-field__message-input"
          placeholder="Enter a message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button className="btn btn--small" onClick={sendMessage}>
          Send
        </button>
      </form>
    </div>
  );
};

export default PrivateChat;
