import React from 'react'
import {Button, Form, Input, Segment, Header} from "semantic-ui-react";
import {getAccount, transfer, getAccountDetails} from "../api";
import ValidatedFormField from "./ValidatedFormField";

class NewPayment extends React.Component {

    constructor(props: any) {
        super(props);
        this.state = {
            targetNr:"",
            fromAccountNr: "",
            fromAccountAmount: "",
            accountNrPrompt: 'Please specify the target account number.'
        };
    }

    handleSubmit = (event: Event) => {
        event.preventDefault();
        const {targetNr, amount} = this.state;

        transfer(targetNr, amount, this.props.token)
            .then(result => {
                console.log("transfer ", result);
                this.setState({targetNr: '', amount: 0});
                this.props.onNewTransaction();
                this.handleRefreshAccountDetails();
            })
            .catch(error => this.setState({error}));
    };

    handleTargetChange = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState({targetNr: event.target.value});

            if (event.target.value !== "") {
                getAccount(event.target.value, this.props.token).then(result => {
                    this.setState({accountNrPrompt: result.owner.firstname + " " + result.owner.lastname});
                })
                .catch(error => {
                    this.setState({error: error, accountNrPrompt: 'Unknown account nr specified'});
                });
            }
        }
    };

    handleRefreshAccountDetails = () => {
        getAccountDetails(this.props.token).then(a =>
                this.setState({fromAccountNr: a.accountNr, fromAccountAmount: a.amount}))
            .catch(error => {
                this.setState({error: error});
            });
    };

    componentDidMount() {
        this.handleRefreshAccountDetails();
    }

    handleAmountChange = (event: Event) => {
            this.setState({amount: event.target.value});
    };

    render() {
        this.basicValidationConfig = {
            required: true,
            minAmount: 0.05
        };
        //TODO: disable button if errors
        return (
            <Segment.Group>
                <Segment color="blue">
                    <Header>New Payment</Header>
                </Segment>
                <Segment>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <label>From</label>
                            <Input
                                placeholder="accountNr"
                                value={this.state.fromAccountNr + " [" + this.state.fromAccountAmount + " CHF] " }
                                onChange={this.handleSourceChange}
                                disabled/>
                        </Form.Field>
                        <Form.Field>
                            <label>To</label>
                            <Input
                                onChange={this.handleTargetChange}
                                placeholder="Target Account Number"
                                type="number"
                                value={this.state.targetNr}/>
                            <span>{this.state.accountNrPrompt}</span>
                        </Form.Field>
                        <Form.Field>
                            <ValidatedFormField placeholder="Amount in CHF"
                                                icon="money"
                                                type="number"
                                                validations={this.basicValidationConfig}
                                                value={this.state.amount}
                                                callback={this.handleAmountChange}/>
                        </Form.Field>
                        <Button size='large' content='Pay' color='linkedin'/>
                    </Form>
                </Segment>
            </Segment.Group>
        )
    }
}


export default NewPayment