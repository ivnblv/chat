import React from "react";

const OnlineUsers = ({
  users,
  startPrivateChat,
  unreadMessages,
  displayUsers
}) => {
  const displayUnread = userId => {
    return unreadMessages.includes(userId) ? true : false;
  };

  return (
    <div
      className={`online-users ${!displayUsers ? "online-users--hidden" : ""}`}
    >
      <ul className="online-users__list">
        {users.map(user => (
          <li key={`onlineUser${user.id}`} className="online-users__list-item">
            <div
              onClick={e => startPrivateChat(e, user)}
              className={`online-users__user ${
                displayUnread(user.id) ? "online-users__user--highlighted" : ""
              }`}
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
