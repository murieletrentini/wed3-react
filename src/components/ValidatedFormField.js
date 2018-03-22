import React from 'react';
import {Form, Label, Input} from "semantic-ui-react";


class ValidatedFormField extends React.Component {

    state = {
        messages: [],
    };

    validateIsEmpty = (value : any) => {
        if (value === "") {
            let message = this.props.placeholder + " is mandatory";
            this.setState(state => ({messages: state.messages.concat([message])}));
            return false;
        } else {
            return true;
        }
    };

    validateMinLength = (value : any, minLength : Number) => {
        if (value.length < minLength) {
            let message = this.props.placeholder + " requires at least " + minLength + " characters";
            this.setState(state => ({messages: state.messages.concat([message])}));
            return false;
        } else {
            return true;
        }
    };

    validateEqualTo = (value: any, otherElement: any) => {
        var otherValue = otherElement.value;

        if (value !== otherValue) {
            let message = this.props.placeholder + " is not equal to " + otherElement.placeholder;
            this.setState(state => ({messages: state.messages.concat([message])}));
            return false;
        } else {
            return true;
        }
    };

    validate = (event: Event) => {
        const {validations} = this.props;
        const value = event.target.value;

        // reset
        this.setState({messages: []});

        // validate configured validations
        if (validations) {

            let hasErrors = false;

            Object.keys(validations).forEach(function (key) {
                let validationValue = validations[key];

                if (key === 'required' && validationValue === true ) {
                    if (!this.validateIsEmpty(value)) {
                        hasErrors = true;
                    }
                }

                if (key === "minLength") {
                    if (!this.validateMinLength(value, validationValue)) {
                        hasErrors = true;
                    }
                }

                if (key === "equalTo" && validationValue !== undefined) {
                    if (!this.validateEqualTo(value, validationValue)) {
                        hasErrors = true;
                    }
                }

            }, this);

            // call onChange of parent
            this.props.callback(event, hasErrors);
        }
    };

    render() {
        const { messages} = this.state;
        const {...props} = this.props;

        return (
            <div>
                <Form.Field>
                    <Input {...props} onChange={this.validate} iconPosition="left" />

                    {messages.length > 0 &&
                     <Label pointing color='red' basic>{messages.join(" / ")}</Label>
                    }

                </Form.Field>
            </div>
        );
    }
}

export default ValidatedFormField;
