import React from "react";
import Login from "./components/Login";
import { useRoutes } from "hookrouter";
import GlobalChat from "./components/GlobalChat";

const routes = {
  "/": () => <Login />,
  "/global": () => <GlobalChat />
};

const App = () => {
  const routeResult = useRoutes(routes);
  return routeResult;
};

export default App;
