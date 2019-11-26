import React from "react";
import Login from "./components/Login/Login";
import { useRoutes } from "hookrouter";
import GlobalChat from "./components/GlobalChat/GlobalChat";

const routes = {
  "/": () => <Login />,
  "/chat": () => <GlobalChat />
};

const App = () => {
  const routeResult = useRoutes(routes);
  return routeResult;
};

export default App;
