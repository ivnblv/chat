import React from "react";

const InputField = ({ message, setMessage, send }) => {
  return (
    <form className="input-field">
      <input
        className="input-field__message-input"
        placeholder="Enter a message..."
        value={message}
        onChange={setMessage}
      />
      <button className="btn btn--medium" onClick={send}>
        Send
      </button>
    </form>
  );
};

export default InputField;
