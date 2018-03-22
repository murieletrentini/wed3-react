// @flow

import React from "react";
import {Redirect} from "react-router-dom";

import {Button, Form, Segment, Menu, Message, Grid} from "semantic-ui-react";
import ValidatedFormField from "./ValidatedFormField";
import {signup} from "../api";


class Signup extends React.Component {

    state = {
        login: "",
        firstname: "",
        lastname: "",
        password: {
            value: "",
            placeholder: "Password"
        },
        confirmedPassword: {
            value: "",
            placeholder: "Confirm Password"
        },
        error: null,
        redirectToReferrer: false
    };

    handleLoginChanged = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState({login: event.target.value});
        }
    };

    handleFirstNameChanged = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState({firstname: event.target.value});
        }
    };

    handleLastNameChanged = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState({lastname: event.target.value});
        }
    };

    handlePasswordChanged = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            let password = {...this.state.password};
            password.value = event.target.value;
            this.setState({password});
        }
    };

    handleConfirmPasswordChanged = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            let confirmedPassword = {...this.state.confirmedPassword};
            confirmedPassword.value = event.target.value;
            this.setState({confirmedPassword});
        }
    };

    //TODO: gemäss Spezifikation "User wird auf dem Server angelegt und automatisch eingelogged."
    handleSubmit = (event: Event) => {
        event.preventDefault();
        const {login, firstname, lastname, password} = this.state;
        signup(login, firstname, lastname, password.value)
            .then(this.props.authenticate(login, password.value, error => {
                if (error) {
                    this.setState({error});
                } else {
                    this.setState({redirectToReferrer: true, error: null});
                }
            }))
            .catch(error => this.setState({error}));
    };

    render() {
        const {redirectToReferrer, error} = this.state;

        if (redirectToReferrer) {
            console.log("redirecting to dashboard");
            return <Redirect to="/dashboard"/>;
        }

        this.basicValidationConfig = {
            required: true,
            minLength: 3
        };

        this.confirmValidationConfig = {
            ...this.basicValidationConfig,
            equalTo: this.state.password
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
                                    <Message.Header>Unable to register new user</Message.Header>
                                    <p>Please solve all warnings and try again</p>
                                </Message>
                                }

                                <ValidatedFormField placeholder="Firstname"
                                                    icon="user"
                                                    type="text"
                                                    validations={this.basicValidationConfig}
                                                    value={this.state.firstname}
                                                    onChange={this.handleFirstNameChanged}/>

                                <ValidatedFormField placeholder="Lastname"
                                                    icon="user"
                                                    type="text"
                                                    validations={this.basicValidationConfig}
                                                    value={this.state.lastname}
                                                    onChange={this.handleLastNameChanged}/>

                                <ValidatedFormField placeholder="Username"
                                                    icon="user"
                                                    type="text"
                                                    validations={this.basicValidationConfig}
                                                    value={this.state.login}
                                                    onChange={this.handleLoginChanged}/>

                                <ValidatedFormField icon="lock"
                                                    type="password"
                                                    validations={this.basicValidationConfig}
                                                    value={this.state.password.value}
                                                    placeholder={this.state.password.placeholder}
                                                    onChange={this.handlePasswordChanged} />

                                <ValidatedFormField icon="lock"
                                                    type="password"
                                                    validations={this.confirmValidationConfig}
                                                    value={this.state.confirmedPassword.value}
                                                    placeholder={this.state.confirmedPassword.placeholder}
                                                    onChange={this.handleConfirmPasswordChanged} />

                                <Button size='large' content='Signup' color='linkedin'/>

                            </Grid.Column>
                        </Grid>
                    </Segment>
                </Form>
            </div>
        );
    }
}

export default Signup;
