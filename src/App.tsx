import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import TestPage from "./components/pages/TestPage";

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={HomePage} exact />
        <Route path="/testpage" component={TestPage} exact />
      </Switch>
    </Router>
  );
};

export default App;
