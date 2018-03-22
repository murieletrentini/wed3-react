import React from 'react'
import {Container, Grid} from "semantic-ui-react";
import NewPayment from "./NewPayment";
import LatestTransactions from "./LatestTransactions";
import {getTransactions} from "../api";

class Dashboard extends React.Component {
    state = {
        transactions: []
    };

    componentDidMount() {
        console.log(this.props);
        getTransactions(this.props.token)
            .then(result => {
                console.log("transactions ", result.result);
                this.setState({transactions: result.result});
            })
            .catch(error => this.setState({error}));
    }

    //TODO: does not work yet
    updateSibling = () => {
        console.log("fetching transactions");
        getTransactions(this.props.token)
            .then(result => {
                console.log("transactions ", result.result);
                this.setState({transactions: result.result});
            })
            .catch(error => this.setState({error}));
    };

    render() {
        return (
            <Container>
                <Grid stackable columns={2}>
                    <Grid.Column>
                        <NewPayment updateSibling={this.updateSibling} {...this.props} />
                    </Grid.Column>
                    <Grid.Column>
                        <LatestTransactions transactions={this.state.transactions}/>
                    </Grid.Column>
                </Grid>
            </Container>)
    }
}


export default Dashboard