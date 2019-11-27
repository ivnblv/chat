import React, { useState, useEffect, useRef } from "react";
import StatusBar from "../StatusBar/StatusBar";
import InputField from "../InputField/InputField";
import ChatMessage from "./ChatMessage/ChatMessage";
import { Scrollbars } from "react-custom-scrollbars";

const Chat = ({ username, socket, autoScroll }) => {
  const [message, setMessage] = useState("");
  const [messages, updateMessages] = useState([]);
  const [statusMessage, updateStatusMessage] = useState([]);
  const scrollBar = useRef(null);

  useEffect(() => {
    socket.on("updateChat", data => updateMessages(data));
    if (messages.length > 0) {
      autoScroll(scrollBar, ".chat__messages", ".chat-message");
    }
    return () => socket.removeAllListeners("updateChat");
  }, [messages]);
  useEffect(() => {
    socket.on("updateStatus", data => updateStatusMessage(data.message));
    let timer;
    if (statusMessage !== "") {
      timer = setTimeout(() => {
        updateStatusMessage("");
      }, 2000);
    }

    return () => {
      socket.removeAllListeners("updateStatus");
      clearTimeout(timer);
    };
  }, [statusMessage]);

  const sendMessage = e => {
    e.preventDefault();
    if (message.length > 0) {
      socket.emit("message", { username, message });
      scrollBar.current.scrollToBottom();
      setMessage("");
    }
  };
  const messageHandler = e => {
    setMessage(e.target.value);
    socket.emit("typing", { username });
  };

  return (
    <div className="chat">
      <Scrollbars
        ref={scrollBar}
        renderView={props => <div {...props} className="scrollbar-view" />}
        renderThumbVertical={props => (
          <div {...props} className="thumb-vertical" />
        )}
      >
        <div className="chat__messages">
          {messages.map((message, i) => (
            <ChatMessage key={`chatMessage${i}`} message={message} />
          ))}
        </div>
      </Scrollbars>
      <StatusBar message={statusMessage} />
      <InputField
        message={message}
        setMessage={messageHandler}
        send={sendMessage}
      />
    </div>
  );
};

export default Chat;
