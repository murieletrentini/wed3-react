// @flow

import React from "react";
import {Redirect} from "react-router-dom";
import {Button, Form, Segment, Menu, Message, Container, Header} from "semantic-ui-react";
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

    constructor(props: any) {
        super(props);
        this.state = {
            login: "",
            password: "",
            error: undefined,
            redirectToReferrer: false,
            redirectToRegister: false,
            validationErrorMap: new Map([
                ["Login",   [true]],
                ["Password", [true]]]),
            hasValidationErrors: true,
        };
    }

    handleLoginCallback = (event: Event, hasErrors: Boolean) => {
        if (event.target instanceof HTMLInputElement) {
            this.handleValidationComponents(event, hasErrors);
            this.setState({login: event.target.value});
        }
    };

    handlePasswordCallback = (event: Event, hasErrors: Boolean) => {
        if (event.target instanceof HTMLInputElement) {
            this.handleValidationComponents(event, hasErrors);
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
        this.setState({redirectToRegister: true});
    };

    handleValidationComponents = (event: Event, elementHasErrors: Boolean) => {
        let validationErrorMap = this.state.validationErrorMap;
        validationErrorMap.set(event.target.placeholder, elementHasErrors);

        this.setState({validationErrorMap: validationErrorMap}, () => {

            let hasErrors = false;
            this.state.validationErrorMap.forEach((value, key, mapObj) => {
                if (value) {
                    hasErrors = value;
                }
            });

            this.setState({hasValidationErrors: hasErrors});
        });
    };


    render() {
        const {redirectToReferrer, redirectToRegister, error} = this.state;
        const {from} = this.props.location.state || {
            from: {pathname: "/dashboard"}
        };

        if (redirectToReferrer) {
            return <Redirect to={from}/>;
        }

        if (redirectToRegister) {
            return <Redirect to="/signup"/>
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
                <Container>
                    <Segment.Group>
                        <Segment color="blue">
                            <Header>Welcome to the Finance Portal!</Header>
                        </Segment>
                        <Segment>
                            <Form onSubmit={this.handleSubmit}>

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
                                                    callback={this.handleLoginCallback}/>

                                <ValidatedFormField placeholder="Password"
                                                    icon="lock"
                                                    type="password"
                                                    value={this.state.password}
                                                    validations={this.basicValidationConfig}
                                                    callback={this.handlePasswordCallback}/>

                                <Button size='large' content='Login' color='linkedin'
                                        disabled={this.state.hasValidationErrors}/>

                            </Form>
                        </Segment>
                    </Segment.Group>
                </Container>
            </div>
        );
    }
}

export default Login;
