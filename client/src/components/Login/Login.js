import React, { useState, useEffect } from "react";
import { navigate } from "hookrouter/dist/router";
import uuidv4 from "uuid/v4";
import socket from "../../socket";

const Login = () => {
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    socket.on("loginFailure", loginFailure);
    socket.on("loginSuccess", enterChat);

    return () => {
      socket.off("loginFailure", loginFailure);
      socket.off("loginSuccess", enterChat);
    };
  }, []);
  const loginFailure = errorMessage => {
    setErrorMessage(errorMessage);
  };

  const generateUsername = () => {
    return `user_${uuidv4().substring(0, 5)}`;
  };

  const enterChat = username => {
    sessionStorage.setItem("username", username);
    navigate("/chat");
  };
  const login = e => {
    e.preventDefault();
    username.length > 0
      ? socket.emit("loginAttempt", username)
      : enterChat(generateUsername());
  };

  return (
    <div className="login">
      <form className="login__form">
        <h2 className="login__title">Join</h2>
        <input
          className="login__username"
          maxLength="15"
          value={username}
          onChange={e => setUsername(e.target.value)}
          type="text"
          name="name"
          placeholder="Enter username..."
        />
        <div className="login__error-message">{errorMessage}</div>
        <button className="btn btn--large" onClick={login}>
          Enter
        </button>
      </form>
    </div>
  );
};

export default Login;
