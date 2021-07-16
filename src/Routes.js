import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage"
import UserProfile from "./components/UserProfile"

const Routes = () => (
  <div>  
    <Router >
      <Switch>
      <Route exact path="/">
        <LoginPage />
      </Route>

      <Route path="/home">
        <Home />
      </Route>

      <Route path="/userprofile">
        <UserProfile />
      </Route>

    </Switch>
    </Router>
  </div>
);

export default Routes;