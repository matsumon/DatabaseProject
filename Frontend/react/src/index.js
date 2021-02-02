import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import './index.css';
import LogIn from './LogIn';
import User from './User';
import Session from './Session';
import Role from './Role';
import Action from './Action';
import Credential from './Credential';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Router>
    <Switch>
          <Route exact path="/Users">
            <User />
          </Route>
          <Route exact path="/Sessions/:userId">
            <Session />
          </Route>
          <Route exact path="/Roles/:userId">
            <Role />
          </Route>
          <Route exact path="/Actions/:userId/:actionId?">
            <Action />
          </Route>
          <Route exact path="/Credentials/:userId">
            <Credential />
          </Route>
          <Route exact path="/">
            <LogIn />
          </Route>
        </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
