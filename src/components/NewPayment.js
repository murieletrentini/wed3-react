import React from 'react'
import {Button, Form, Input, Segment, Header, Message} from "semantic-ui-react";
import {getAccount, transfer, getAccountDetails} from "../api";
import ValidatedFormField from "./ValidatedFormField";

const defaultPromptText = 'Please specify the target account number.'

class NewPayment extends React.Component {

    constructor(props: any) {
        super(props);

        this.state = {
            toAccountNr:'',
            fromAccountNr: '',
            fromAccountAmount: '',
            amount: '',
            accountNrPrompt: defaultPromptText,
            success: false,
            error: null,
            validationErrorMap: new Map([
                ["Amount in CHF", [true]],
                ["Target Account Number", [true]]]),
            hasValidationErrors: true,
        };
    }

    handleSubmit = (event: Event) => {
        event.preventDefault();
        const {toAccountNr, amount} = this.state;
        transfer(toAccountNr, amount, this.props.token)
            .then(result => {
                this.props.onNewTransaction();
                this.handleRefreshAccountDetails();
                this.setState({success: true, accountNrPrompt: defaultPromptText});
            })
            .catch(error => this.setState({error}));
    };

    handleTargetChange = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {

            this.setState({toAccountNr: event.target.value});

            let placeholder: String = event.target.placeholder;
            if (event.target.value !== "") {
                getAccount(event.target.value, this.props.token).then(result => {
                    this.setState({accountNrPrompt: result.owner.firstname + " " + result.owner.lastname});
                    this.handleValidationComponents(placeholder, false);
                })
                .catch(error => {
                    this.state.validationErrorMap.set("Target Account Number", true);
                    this.handleValidationComponents(placeholder, true);
                    this.setState({error: error, accountNrPrompt: 'Unknown account nr specified'});
                });
            } else {
                this.state.validationErrorMap.set("Target Account Number", true);
                this.handleValidationComponents(placeholder, true);
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

    handleAmountChange = (event: Event, hasErrors: Boolean) => {
        this.handleValidationComponents(event.target.placeholder, hasErrors);
        this.setState({amount: event.target.value});
    };

    handleStartOverClicked = (event: Event) => {
        this.setState({
            success: false,
            toAccountNr: '',
            amount: '',
            validationErrorMap: new Map([
                ["Amount in CHF", [true]],
                ["Target Account Number", [true]]]),});
    };

    handleValidationComponents = (placeholder: String, elementHasErrors: Boolean) => {
        let validationErrorMap = this.state.validationErrorMap;
        validationErrorMap.set(placeholder, elementHasErrors);

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


    render() {
        this.basicValidationConfig = {
            required: true,
            minAmount: 0.05
        };
        return (
            <Segment.Group>
                <Segment color="blue">
                    <Header>New Payment</Header>
                </Segment>
                <Segment>
                    {this.state.success ? (
                        <div>
                            <p>Transaction to {this.state.toAccountNr} succeeded!</p>
                            <p>New balance {this.state.fromAccountAmount} CHF</p>

                            <Button onClick={this.handleStartOverClicked} size='large' content='Start over' color='linkedin'/>
                        </div>
                    ) : (
                        <Form onSubmit={this.handleSubmit} noValidate>
                            <Form.Field>
                                <label>From</label>
                                <Input
                                    placeholder="accountNr"
                                    value={this.state.fromAccountNr + " [" + this.state.fromAccountAmount + " CHF] " }
                                    disabled
                                    readOnly/>
                            </Form.Field>
                            <Form.Field>
                                <label>To</label>
                                <Input
                                    onChange={this.handleTargetChange}
                                    placeholder="Target Account Number"
                                    type="number"
                                    value={this.state.toAccountNr}/>
                                <Message content={this.state.accountNrPrompt} info />
                            </Form.Field>
                            <Form.Field>
                                <ValidatedFormField placeholder="Amount in CHF"
                                                    icon="money"
                                                    type="number"
                                                    validations={this.basicValidationConfig}
                                                    value={this.state.amount}
                                                    callback={this.handleAmountChange}/>
                            </Form.Field>

                            <Button size='large' content='Pay' color='linkedin'
                                    disabled={this.state.hasValidationErrors} />

                        </Form>
                    )}
                </Segment>
            </Segment.Group>
        )
    }
}


export default NewPayment