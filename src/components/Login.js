// @flow

import React from "react";
import {Redirect, Link} from "react-router-dom";
import {Button, Form, Input, Segment} from "semantic-ui-react";

export type Props = {
    /* Callback to submit an authentication request to the server */
    authenticate: (login: string,
                   password: string,
                   callback: (error: ?Error) => void) => void,
    /* We need to know what page the user tried to access so we can
       redirect after logging in */
    location: {
        state?: {
            from: string
        }
    }
};

class Login extends React.Component<Props, *> {
    state = {
        login: "",
        password: "",
        error: undefined,
        redirectToReferrer: false
    };

    handleLoginChanged = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState({login: event.target.value});
        }
    };

    handlePasswordChanged = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState({password: event.target.value});
        }
    };

    handleSubmit = (event: Event) => {
        event.preventDefault();
        const {login, password} = this.state;
        this.props.authenticate(login, password, error => {
            if (error) {
                this.setState({error});
            } else {
                this.setState({redirectToReferrer: true, error: null});
            }
        });
    };

    render() {
        const {redirectToReferrer, error} = this.state;

        if (redirectToReferrer) {
            return <Redirect to="/dashboard"/>;
        }

        return (
            <div>
                <h1>Bank of Rapperswil</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Segment>
                        <Form.Field>
                            <Input
                                onChange={this.handleLoginChanged}
                                placeholder="Login"
                                icon="user" iconPosition="left"
                                value={this.state.login}/>
                            <Input
                                onChange={this.handlePasswordChanged}
                                placeholder="Password"
                                icon="lock" iconPosition="left"
                                type="password"
                                value={this.state.password}/>
                        </Form.Field>
                        <Button size='large' content='Login' color='linkedin'/>
                    </Segment>
                </Form>
                {error && <p>An error occurred!</p>}
                <Link to="/signup">Don't have an account?</Link>
            </div>
        );
    }
}

export default Login;
