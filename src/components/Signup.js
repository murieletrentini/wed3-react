// @flow

import React from "react";
import {Redirect, Link} from "react-router-dom";

import {Button, Form, Segment, Menu, Message, Container, Header} from "semantic-ui-react";
import ValidatedFormField from "./ValidatedFormField";
import {signup} from "../api";


class Signup extends React.Component {

    constructor() {
        super();
        this.state = {
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
            unequalPasswords: null,
            validationErrorMap: new Map([
                ["Firstname",   [true]],
                ["Lastname", [true]],
                ["Username", [true]],
                ["Password", [true]],
                ["Confirm Password", [true]]]),
            hasValidationErrors: true,
            redirectToReferrer: false
        };
    }


    handleLoginCallback = (event: Event, hasErrors: Boolean) => {
        if (event.target instanceof HTMLInputElement) {
            this.handleValidationComponents(event, hasErrors);
            this.setState({login: event.target.value});
        }
    };

    handleFirstNameCallback = (event: Event, hasErrors: Boolean) => {
        if (event.target instanceof HTMLInputElement) {
            this.handleValidationComponents(event, hasErrors);
            this.setState({firstname: event.target.value});
        }
    };

    handleLastNameCallback = (event: Event, hasErrors: Boolean) => {
        if (event.target instanceof HTMLInputElement) {
            this.handleValidationComponents(event, hasErrors);
            this.setState({lastname: event.target.value});
        }
    };

    handlePasswordCallback = (event: Event, hasErrors: Boolean) => {
        if (event.target instanceof HTMLInputElement) {
            let password = {...this.state.password};
            password.value = event.target.value;

            this.handleValidationComponents(event, hasErrors);
            this.setState({password: password, unequalPasswords: null});
        }
    };

    handleConfirmPasswordCallback = (event: Event, hasErrors: Boolean) => {
        if (event.target instanceof HTMLInputElement) {
            let confirmedPassword = {...this.state.confirmedPassword};
            confirmedPassword.value = event.target.value;

            this.handleValidationComponents(event, hasErrors);

            this.setState({confirmedPassword: confirmedPassword, unequalPasswords: null});
        }
    };

    handleValidationComponents = (event: Event, elementHasErrors: Boolean) => {
        let validationErrorMap = this.state.validationErrorMap;
        validationErrorMap.set(event.target.placeholder, elementHasErrors);

        this.setState({validationErrorMap: validationErrorMap}, () => {

            let hasErrors = false;
            this.state.validationErrorMap.forEach((value, key, mapObj) => {
                if (value) {
                    hasErrors = true;
                }
            });

            this.setState({hasValidationErrors: hasErrors});
        });
    };

    handleSubmit = (event: Event) => {
        event.preventDefault();

        const {login, firstname, lastname, password, confirmedPassword} = this.state;
        if (password.value !== confirmedPassword.value){
            this.setState({unequalPasswords: true});
        } else {
            signup(login, firstname, lastname, password.value)
                .then(this.props.authenticate(login, password.value, error => {
                    if (error) {
                        this.setState({error});
                    } else {
                        this.setState({redirectToReferrer: true, error: null});
                    }
                }))
                .catch(error => this.setState({error}));
        }
    };

    render() {
        const {redirectToReferrer, error, unequalPasswords} = this.state;

        if (redirectToReferrer) {
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
                    <Menu.Item>
                        <Link to="/welcome">Back</Link>
                    </Menu.Item>
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
                                    <Message.Header>Unable to register new user</Message.Header>
                                    <p>Error occured while trying to register new user</p>
                                </Message>
                                }
                                {unequalPasswords &&
                                <Message negative>
                                    <Message.Header>Unable to register new user</Message.Header>
                                    <p>Passwords are not equal</p>
                                </Message>
                                }

                                <ValidatedFormField placeholder="Firstname"
                                                    icon="id badge"
                                                    type="text"
                                                    validations={this.basicValidationConfig}
                                                    value={this.state.firstname}
                                                    callback={this.handleFirstNameCallback}/>

                                <ValidatedFormField placeholder="Lastname"
                                                    icon="id badge"
                                                    type="text"
                                                    validations={this.basicValidationConfig}
                                                    value={this.state.lastname}
                                                    callback={this.handleLastNameCallback}/>
                                <ValidatedFormField placeholder="Username"
                                                    icon="user"
                                                    type="text"
                                                    validations={this.basicValidationConfig}
                                                    value={this.state.login}
                                                    callback={this.handleLoginCallback}/>
                                <ValidatedFormField icon="lock"
                                                    type="password"
                                                    validations={this.basicValidationConfig}
                                                    value={this.state.password.value}
                                                    placeholder={this.state.password.placeholder}
                                                    callback={this.handlePasswordCallback}/>
                                <ValidatedFormField icon="lock"
                                                    type="password"
                                                    validations={this.confirmValidationConfig}
                                                    value={this.state.confirmedPassword.value}
                                                    placeholder={this.state.confirmedPassword.placeholder}
                                                    callback={this.handleConfirmPasswordCallback}/>

                                <Button size='large' content='Signup' color='linkedin'
                                        disabled={this.state.hasValidationErrors}/>
                            </Form>
                        </Segment>
                    </Segment.Group>
                </Container>
            </div>
        )
            ;
    }
}

export default Signup;
