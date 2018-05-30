import React from 'react'
import {Container, Grid} from "semantic-ui-react";
import NewPayment from "./NewPayment";
import LatestTransactions from "./LatestTransactions";
import {getTransactions} from "../api";


class Dashboard extends React.Component {


    constructor(props: any) {
        super(props);
        this.state = {
            transactions: []
        };
    }

    componentDidMount() {
        this.loadTransactions();
    }

    loadTransactions = () => {
        getTransactions(this.props.token)
            .then(result => {
                this.setState({transactions: result.result});
            })
            .catch(error => this.setState({error}));
    };

    render() {
        return (
            <Container>
                <Grid stackable>
                    <Grid.Row columns={2}>
                        <Grid.Column width={5}>
                            <NewPayment onNewTransaction={this.loadTransactions} {...this.props} />
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <LatestTransactions transactions={this.state.transactions}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>)
    }
}


export default Dashboard