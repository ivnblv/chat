import React, { useState, useEffect } from "react";
import { navigate } from "hookrouter/dist/router";
import uuidv4 from "uuid/v4";

const Login = () => {
  const [username, setUsername] = useState("");
  useEffect(() => {
    sessionStorage.removeItem("username");
  }, []);

  const generateUsername = () => {
    return `user_${uuidv4().substring(0, 5)}`;
  };

  const enterChat = e => {
    if (username.length === 0) {
      sessionStorage.setItem("username", generateUsername());
    } else {
      sessionStorage.setItem("username", username);
    }
    navigate("/global");
  };

  return (
    <div className="login">
      <form className="login__form">
        <h2 className="login__title">Join</h2>
        <input
          className="login__username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          type="text"
          name="name"
          placeholder="Enter username..."
        />
        <button className="login__enter-btn" onClick={enterChat}>
          Enter
        </button>
      </form>
    </div>
  );
};

export default Login;
