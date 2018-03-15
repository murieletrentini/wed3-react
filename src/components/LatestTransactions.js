import React from 'react'
import {Header, Segment, Table} from "semantic-ui-react";
import {Link} from "react-router-dom";
import TableItem from "../presentationComponents/TableItem";
import {getTransactions} from "../api";


class LatestTransactions extends React.Component {
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
            <Segment.Group compact>
                <Segment color="blue">
                    <Header>Latest Transactions</Header>
                </Segment>
                <Segment>
                    <Table basic='very'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Source</Table.HeaderCell>
                                <Table.HeaderCell>Target</Table.HeaderCell>
                                <Table.HeaderCell>Amount [CHF]</Table.HeaderCell>
                                <Table.HeaderCell>Balance [CHF]</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.state.transactions.map(
                                transaction => <TableItem {...transaction}/>
                            )}
                        </Table.Body>
                    </Table>
                    <Link className="ui linkedin large button" to="/dashboard/transactions">
                        All Transactions
                    </Link>
                </Segment>
            </Segment.Group>
        )
    }
}


export default LatestTransactions