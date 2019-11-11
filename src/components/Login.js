import React, { useState } from "react";
import { navigate } from "hookrouter/dist/router";

const Login = () => {
  const [username, setUsername] = useState("");

  const ID = () => {
    return `user_${Math.random().toString(36)}`;
  };

  const enterChat = () => {
    username.length === 0
      ? sessionStorage.setItem("username", ID())
      : sessionStorage.setItem("username", username);
    navigate("/global");
  };

  return (
    <div className="login">
      <label htmlFor="name">Enter username</label>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        type="text"
        name="name"
        placeholder="Enter name"
      />
      <button onClick={enterChat}>Enter</button>
    </div>
  );
};

export default Login;
