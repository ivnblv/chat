import React from "react";

const OnlineUsers = ({ users, startPrivateChat }) => {
  return (
    <div className="online-users">
      <ul className="online-users__list">
        {users.map(user => (
          <li className="online-users__item">
            <div
              onClick={() => startPrivateChat(user)}
              className="online-users__user"
            >
              {user.username}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
