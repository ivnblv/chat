import React, { useState, useEffect, useRef } from "react";
import { Scrollbars } from "react-custom-scrollbars";

const PrivateChat = ({
  socket,
  username,
  currentPrivateChat,
  closePrivateChat,
  history,
  autoScroll
}) => {
  const [message, setMessage] = useState("");
  const scrollBar = useRef(null);

  const sendMessage = e => {
    e.preventDefault();
    if (message.length > 0) {
      socket.emit("sendPrivateMessage", {
        to: currentPrivateChat.id,
        username: username,
        message
      });
      setMessage("");
    }
  };

  useEffect(() => {
    if (history.messages.length > 0) {
      autoScroll(
        scrollBar,
        ".private-chat__messages",
        ".private-chat__message"
      );
    }
  }, [history.messages.length]);

  return (
    <div className="private-chat">
      <div className="private-chat__header">
        <div className="private-chat__title">{currentPrivateChat.username}</div>
        <button className="close-btn" onClick={closePrivateChat}>
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="times"
            className="close-btn__img"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 352 512"
          >
            <path
              fill="currentColor"
              d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
            />
          </svg>
        </button>
      </div>
      <Scrollbars
        ref={scrollBar}
        renderView={props => <div {...props} className="scrollbar-view" />}
        style={{ height: "100%" }}
        className="private-chat__scroll"
        renderThumbVertical={props => (
          <div {...props} className="thumb-vertical thumb-vertical--small" />
        )}
      >
        <div className="private-chat__messages">
          {history
            ? history.messages.map((message, i) => (
                <div
                  key={`message${i}`}
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
