import React from "react";
import Login from "./components/Login";
import { useRoutes } from "hookrouter";
import GlobalChat from "./components/GlobalChat";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const routes = {
  "/": () => <Login />,
  "/global": () => <GlobalChat />
};

const App = () => {
  const routeResult = useRoutes(routes);
  return routeResult;
  // return (
  //   <Router>
  //     <Switch>
  //       <Route path="/" component={Login} />
  //       <Route path="/global" component={GlobalChat} />
  //     </Switch>
  //   </Router>
  // );
};

export default App;
