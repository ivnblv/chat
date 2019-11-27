import React from "react";

const PrivateChatMessage = ({ username, message }) => {
  return (
    <div
      className={`private-message ${
        message.username === username
          ? "private-message--right"
          : "private-message--left"
      }`}
    >
      <p
        className={`private-message__text ${
          message.username === username
            ? "private-message__text--right"
            : "private-message__text--left"
        }`}
      >
        {message.message}
      </p>
      <p
        className={`private-message__username ${
          message.username === username
            ? "private-message__username--right"
            : "private-message__username--left"
        }`}
      >
        {message.username}
      </p>
    </div>
  );
};

export default PrivateChatMessage;
