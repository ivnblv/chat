import React from "react";

const StatusBar = ({ message }) => {
  return (
    <div className="status-bar">
      <h5 className="status-bar__text">{message}</h5>
    </div>
  );
};

export default StatusBar;
