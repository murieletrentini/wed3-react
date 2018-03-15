// @flow
//https://react.semantic-ui.com/
import React from "react";
import {
    BrowserRouter as Router, Link,
    Route,
    withRouter
} from "react-router-dom";
import {Redirect} from 'react-router'

import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AllTransactions from "./components/AllTransactions";

import PrivateRoute from "./components/PrivateRoute";

import * as api from "./api";

import type {User} from "./api";
import {Menu} from "semantic-ui-react";

type State = {
    isAuthenticated: boolean,
    token: ?string,
    user: ?User
};

class App extends React.Component<{}, State> {
    constructor(props: any) {
        super(props);
        const token = sessionStorage.getItem("token");
        const user = sessionStorage.getItem("user");
        if (token && user) {
            this.state = {
                isAuthenticated: true,
                token,
                user: JSON.parse(user)
            };
        } else {
            this.state = {
                isAuthenticated: false,
                token: undefined,
                user: undefined
            };
        }
    }

    authenticate = (login: string,
                    password: string,
                    cb: (error: ?Error) => void) => {
        api
            .login(login, password)
            .then(({token, owner}) => {
                this.setState({isAuthenticated: true, token, user: owner});
                sessionStorage.setItem("token", token);
                sessionStorage.setItem("user", JSON.stringify(owner));
                cb(null);
            })
            .catch(error => cb(error));
    };

    signout = (callback: () => void) => {
        this.setState({
            isAuthenticated: false,
            token: undefined,
            user: undefined
        });
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        callback();
    };


    render() {
        const {isAuthenticated, user, token} = this.state;

        const MenuBar = withRouter(({history, location: {pathname}}) => {
            if (isAuthenticated && user) {
                return (
                    <Menu>
                        <Menu.Item name='user'>
                            {user.firstname} {user.lastname} &ndash; {user.accountNr}
                        </Menu.Item>
                        <Menu.Item name='dashboard'  onClick={event => {
                            event.preventDefault();
                            history.push("/dashboard");
                        }}>
                            Dashboard
                        </Menu.Item>
                        <Menu.Item name='transactions' onClick={event => {
                            event.preventDefault();
                            history.push("/dashboard/transactions");
                        }}>
                            Dashboard
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item name='logout' onClick={event => {
                                event.preventDefault();
                                this.signout(() => history.push("/"));
                            }}>
                                Logout
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                );
            } else {
                return null;
            }
        });

        return (
            <Router>
                <div>
                    <MenuBar/>
                    <Route
                        exact
                        path="/"
                        render={props => (
                            (isAuthenticated && user) ? <Redirect to="/dashboard"/> :
                                <Redirect to="/welcome"/>
                        )}
                    />
                    <Route
                        exact
                        path="/welcome"
                        render={props => (
                            <Login {...props} authenticate={this.authenticate}/>
                        )}
                    />
                    <Route path="/signup" component={Signup}/>
                    {/*
            The following are protected routes that are only available for logged-in users. We also pass the user and token so 
            these components can do API calls. PrivateRoute is not part of react-router but our own implementation.
          */}
                    <PrivateRoute
                        path="/dashboard"
                        isAuthenticated={isAuthenticated}
                        user={user}
                        token={token}
                        component={Dashboard}
                    />
                    <PrivateRoute
                        path="/dashboard/transactions"
                        isAuthenticated={isAuthenticated}
                        token={token}
                        user={user}
                        component={AllTransactions}
                    />
                </div>
            </Router>
        );
    }
}

export default App;
