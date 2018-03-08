// @flow

import React from "react";
import { Redirect } from "react-router-dom";

import { signup } from "../api";

class Signup extends React.Component<{}, *> {
  state = {
    login: "",
    firstname: "",
    lastname: "",
    password: "",
    error: null,
    redirectToReferrer: false
  };

  handleLoginChanged = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.setState({ login: event.target.value });
    }
  };

  handleFirstNameChanged = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.setState({ firstname: event.target.value });
    }
  };

  handleLastNameChanged = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.setState({ lastname: event.target.value });
    }
  };

  handlePasswordChanged = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.setState({ password: event.target.value });
    }
  };

  handleSubmit = (event: Event) => {
    event.preventDefault();
    const { login, firstname, lastname, password } = this.state;
    signup(login, firstname, lastname, password)
      .then(result => {
        console.log("Signup result ", result);
        this.setState({ redirectToReferrer: true, error: null });
      })
      .catch(error => this.setState({ error }));
  };

  render() {
    const { redirectToReferrer, error } = this.state;

    if (redirectToReferrer) {
      return <Redirect to="/login" />;
    }

    return (
      <div>
        <h1>Bank of Rapperswil</h1>
        <form>
          <h2>Sign Up</h2>
          <input
            onChange={this.handleLoginChanged}
            placeholder="Login"
            value={this.state.login}
          />
          <input
            onChange={this.handleFirstNameChanged}
            placeholder="Name"
            value={this.state.firstname}
          />
          <input
            onChange={this.handleLastNameChanged}
            placeholder="Surname"
            value={this.state.lastname}
          />
          <input
            onChange={this.handlePasswordChanged}
            placeholder="Password"
            type="password"
            value={this.state.password}
          />
          <button onClick={this.handleSubmit}>Open account</button>
        </form>
        {error && <p>An error occurred!</p>}
      </div>
    );
  }
}

export default Signup;
