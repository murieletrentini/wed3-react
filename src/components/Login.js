// @flow

import React from "react";
import {Redirect} from "react-router-dom";
import {Button, Form, Segment, Menu, Message, Grid} from "semantic-ui-react";
import ValidatedFormField from "./ValidatedFormField";

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

class Login extends React.Component {

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

    handleSignupClicked = (event: Event) => {
        event.preventDefault();
        window.location = '/signup';
    };

    render() {
        const { redirectToReferrer, error } = this.state;
        const { from } = this.props.location.state || {
            from: { pathname: "/dashboard" }
        };

        if (redirectToReferrer) {
            return <Redirect to={from} />;
        }

        this.basicValidationConfig = {
            required: true,
            minLength: 3
        };

        return (
            <div>
                <Menu>
                    <Menu.Item header>Bank of Rapperswil</Menu.Item>
                    <Menu.Item position='right'>
                        <Button size='large' content='Register' color='linkedin' onClick={this.handleSignupClicked}/>
                    </Menu.Item>
                </Menu>
                <Form onSubmit={this.handleSubmit}>
                    <Segment>

                        <Grid container>

                            <Grid.Column>
                                {error &&
                                <Message negative>
                                    <Message.Header>Invalid credentials entered</Message.Header>
                                    <p>Please try again</p>
                                </Message>
                                }

                                <ValidatedFormField placeholder="Login"
                                                    icon="user"
                                                    type="text"
                                                    value={this.state.login}
                                                    validations={this.basicValidationConfig}
                                                    onChange={this.handleLoginChanged} />

                                <ValidatedFormField placeholder="Password"
                                                    icon="lock"
                                                    type="password"
                                                    value={this.state.password}
                                                    validations={this.basicValidationConfig}
                                                    onChange={this.handlePasswordChanged} />

                                <Button size='large' content='Login' color='linkedin'/>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                </Form>
            </div>
        );
    }
}

export default Login;
