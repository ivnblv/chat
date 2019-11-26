import React from "react";
import { Scrollbars } from "react-custom-scrollbars";

const OnlineUsers = ({
  users,
  startPrivateChat,
  displayUsers,
  isUnread,
  privateHistory
}) => {
  const sortUsersByHistory = (x, y) => {
    let xInPrivateHistory = privateHistory.find(element => element.id === x.id);
    let yInPrivateHistory = privateHistory.find(element => element.id === y.id);
    if (xInPrivateHistory === undefined) {
      xInPrivateHistory = { messages: [] };
    }
    if (yInPrivateHistory === undefined) {
      yInPrivateHistory = { messages: [] };
    }
    return xInPrivateHistory.messages.length > yInPrivateHistory.messages.length
      ? -1
      : xInPrivateHistory.messages.length < yInPrivateHistory.messages.length
      ? 1
      : 0;
  };
  return (
    <div
      className={`online-users ${!displayUsers ? "online-users--hidden" : ""}`}
    >
      <Scrollbars
        renderThumbVertical={props => (
          <div {...props} className="thumb-vertical" />
        )}
      >
        <ul className="online-users__list">
          {[...users]
            .sort((x, y) => sortUsersByHistory(x, y))
            .map(user => (
              <li
                key={`onlineUser${user.id}`}
                className="online-users__list-item"
              >
                <div
                  onClick={e => startPrivateChat(e, user)}
                  className={`online-users__user ${
                    isUnread(user.id) ? "online-users__user--highlighted" : ""
                  }`}
                >
                  {user.username}
                </div>
              </li>
            ))}
        </ul>
      </Scrollbars>
    </div>
  );
};

export default OnlineUsers;
