import React, { useEffect, useRef } from "react";
import StatusBar from "../StatusBar/StatusBar";
import { Scrollbars } from "react-custom-scrollbars";

const Chat = ({
  message,
  type,
  messages,
  statusMessage,
  sendMessage,
  autoScroll
}) => {
  const scrollBar = useRef(null);

  useEffect(() => {
    if (messages.length > 0) {
      autoScroll(scrollBar, ".chat__messages", ".chat__message");
    }
  }, [messages]);

  return (
    <div className="chat">
      <Scrollbars
        ref={scrollBar}
        renderView={props => <div {...props} id="fortest" />}
        renderThumbVertical={props => (
          <div {...props} className="thumb-vertical" />
        )}
      >
        <div className="chat__messages">
          {messages.map((message, i) => (
            <div
              key={`message${message.username + i}`}
              className="chat__message"
            >
              <span className="chat__username">{message.username}:</span>
              {message.message}
            </div>
          ))}
        </div>
      </Scrollbars>
      <StatusBar message={statusMessage} />
      <form className="input-field">
        <input
          className="input-field__message-input"
          type="text"
          placeholder="Enter a message..."
          value={message}
          onChange={e => type(e)}
        />
        <button className="btn btn--medium" onClick={sendMessage}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
