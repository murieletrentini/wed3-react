import React from 'react'
import {Container, Header, Segment, Table} from "semantic-ui-react";
import TableItemAll from "../presentationComponents/TableItemAll";
import {getTransactions} from "../api";


class AllTransactions extends React.Component {
    state = {
        transactions: []
    };

    componentDidMount() {
        getTransactions(this.props.token)
            .then(result => {
                console.log("transactions ", result.result);
                this.setState({transactions: result.result});
            })
            .catch(error => this.setState({error}));
    }

    render() {
        return (
            <Container>
                <Segment.Group>
                    <Segment color="blue">
                        <Header>All Transactions</Header>
                    </Segment>
                    <Segment>
                        <Table basic='very'>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Date</Table.HeaderCell>
                                    <Table.HeaderCell>Source</Table.HeaderCell>
                                    <Table.HeaderCell>Target</Table.HeaderCell>
                                    <Table.HeaderCell>Amount [CHF]</Table.HeaderCell>
                                    <Table.HeaderCell>Balance [CHF]</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {this.state.transactions.map(
                                    transaction => <TableItemAll {...transaction}/>
                                )}
                            </Table.Body>
                        </Table>
                    </Segment>
                </Segment.Group>
            </Container>
        )
    }
}


export default AllTransactions