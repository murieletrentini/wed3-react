import React from 'react';
import {Form, Label, Input} from "semantic-ui-react";


class ValidatedFormField extends React.Component {

    state = {
        messages: [],
    };

    validateIsEmpty = (value : any) => {
        if (value === "") {
            let message = this.props.placeholder + " is mandatory";
            this.setState(state => ({messages: state.messages.concat([message])}))
        }
    };

    validateMinLength = (value : any, minLength : Number) => {
        if (value.length <= minLength) {
            let message = this.props.placeholder + " requires at least " + minLength + " characters";
            this.setState(state => ({messages: state.messages.concat([message])}))
        }
    };

    validateEqualTo = (value: any, otherElement: any) => {
        var otherValue = otherElement.props.value;

        if (value !== otherValue) {
            let message = this.props.placeholder + " is not equal to " + otherElement.props.placeholder;
            this.setState(state => ({messages: state.messages.concat([message])}))
        }
    };

    validate = (event: Event) => {
        const {validations} = this.props;
        const value = event.target.value;

        // reset
        this.setState({messages: []});

        // validate configured validations
        if (validations) {

            Object.keys(validations).forEach(function (key) {
                let validationValue = validations[key];

                if (key === 'required' && validationValue === true ) {
                    this.validateIsEmpty(value)
                }

                if (key === "minLength") {
                    this.validateMinLength(value, validationValue)
                }

                if (key === "equalTo" && validationValue !== undefined) {
                    this.validateEqualTo(value, validationValue);
                }

            }, this);
        }

        // call onChange of parent
        this.props.onChange(event);
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
