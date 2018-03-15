import React from 'react'
import {Container} from "semantic-ui-react";
import NewPayment from "./NewPayment";
import LatestTransactions from "./LatestTransactions";

class Dashboard extends React.Component {
    state = {

    };

    render() {
        return (
            <Container>
                <NewPayment {...this.props}></NewPayment>
                <LatestTransactions {...this.props}></LatestTransactions>
            </Container>)
    }
}


export default Dashboard