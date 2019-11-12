import React from "react";

const OnlineUsers = ({ users }) => {
  return (
    <div className="online-users">
      <ul className="online-users__list">
        {users.map(user => (
          <li className="online-users__item">
            <h5 className="online-users__user">{user}</h5>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
