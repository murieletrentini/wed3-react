import React from 'react'
import {Button, Form, Input, Segment, Header} from "semantic-ui-react";
import {getAccount, transfer} from "../api";

class NewPayment extends React.Component {
    state = {
        accountNrPrompt:'Please specify the target account number.'
    };

    handleSubmit = (event: Event) => {
        event.preventDefault();
        const {targetNr, amount} = this.state;

        transfer(targetNr, amount, this.props.token)
            .then(result => {
                console.log("transfer ", result);
                this.props.updateSibling();
                this.setState({targetNr: 'Target Account Number', amount: 0});
            })
            .catch(error => this.setState({error}));
    };

    handleTargetChange = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState({targetNr: event.target.value});
            getAccount(event.target.value, this.props.token).then(result => {
                this.setState({ accountNrPrompt:result.owner.firstname + " " + result.owner.lastname});
            })
                .catch(error => {this.setState({error:error, accountNrPrompt: 'Unknown account nr specified'});});
        }
    };

    //TODO: without this, react warns about mixing uncontrolled and controlled components... but this function will never be called, because input is disabled...
    handleSourceChange = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState({sourceNr: event.target.value});
        }
    };


    handleAmountChange = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState({amount: event.target.value});
        }
    };

    render() {
        return (
            <Segment.Group compact>
                <Segment color="blue">
                    <Header>New Payment</Header>
                </Segment>
                <Segment>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <Input
                                placeholder="accountNr"
                                value={this.props.user.accountNr}
                                onChange={this.handleSourceChange}
                                disabled/>
                            <Input
                                onChange={this.handleTargetChange}
                                placeholder="Target Account Number"
                                value={this.state.targetNr}/>
                            <span>{this.state.accountNrPrompt}</span>
                            <Input
                                onChange={this.handleAmountChange}
                                placeholder="Amount in CHF"
                                value={this.state.amount}/>
                        </Form.Field>
                        <Button size='large' content='Pay' color='linkedin'/>
                    </Form>
                </Segment>
            </Segment.Group>
        )
    }
}


export default NewPayment