// @flow
//https://react.semantic-ui.com/
import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    withRouter
} from "react-router-dom";
import {Redirect} from 'react-router'

import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AllTransactions from "./components/AllTransactions";

import PrivateRoute from "./components/PrivateRoute";

import * as api from "./api";

import {Icon, Menu} from "semantic-ui-react";

class App extends React.Component {

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
                    <Menu stackable>
                        <Menu.Item header>Account {user.accountNr}</Menu.Item>
                        <Menu.Item name='dashboard' onClick={event => {
                            event.preventDefault();
                            history.push("/dashboard");
                        }}>
                            Dashboard
                        </Menu.Item>
                        <Menu.Item name='transactions' onClick={event => {
                            event.preventDefault();
                            history.push("/dashboard/transactions");
                        }}>
                            All Transactions
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item className="active" color='blue' name='logout' onClick={event => {
                                event.preventDefault();
                                this.signout(() => history.push("/"));
                            }}>
                                <Icon name='log out'/> Logout {user.firstname} {user.lastname}
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
                    <Switch>
                        <Route
                            exact
                            path="/welcome"
                            render={props => (
                                <Login {...props} authenticate={this.authenticate}/>
                            )}
                        />
                        <Route exact
                               path="/signup"
                               render={props => (
                                   <Signup {...props} authenticate={this.authenticate}/>
                               )}
                        />
                        <PrivateRoute
                            exact
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
                        <Route
                            exact
                            path="*"
                            render={props => (
                                (isAuthenticated && user) ? <Redirect to="/dashboard"/> :
                                    <Redirect to="/welcome"/>
                            )}
                        />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
