import React, { useState } from "react";
import { navigate } from "hookrouter/dist/router";
import uuidv4 from "uuid/v4";

const Login = () => {
  const [username, setUsername] = useState("");

  const generateUsername = () => {
    return `user_${uuidv4().substring(0, 5)}`;
  };

  const enterChat = e => {
    e.preventDefault();
    if (username.length === 0) {
      sessionStorage.setItem("username", generateUsername());
    } else {
      sessionStorage.setItem("username", username);
    }
    navigate("/chat");
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
        <button className="btn btn--large" onClick={enterChat}>
          Enter
        </button>
      </form>
    </div>
  );
};

export default Login;
