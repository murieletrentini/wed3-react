import React from 'react';
import {Form, Label, Input} from "semantic-ui-react";


class ValidatedFormField extends React.Component {

    constructor(props: any) {
        super(props);
    }

    state = {
        message: "",
    };

    validate = (event: Event) => {
        let message = "";
        let value = event.target.value;
        if (value === "" || value.length < 3) {
            message = this.props.placeholder + " needs to be at least 3 characters long";
        }
        this.setState({message: message});

        this.props.onChange(event);
    };

    render() {
        const { message } = this.state;

        return (
            <div>
                <Form.Field>
                    <Input onChange={this.validate}
                                placeholder={this.props.placeholder}
                                icon={this.props.icon} iconPosition="left"
                                value={this.props.value} />

                    {message &&
                     <Label pointing color='red' basic>{message}</Label>
                    }
                </Form.Field>


            </div>
        );
    }
}

export default ValidatedFormField;
