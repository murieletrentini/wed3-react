import React from 'react'
import {Header, Segment, Table} from "semantic-ui-react";
import {Link} from "react-router-dom";
import TableItemLatest from "../presentationComponents/TableItemLatest";

class LatestTransactions extends React.Component {

    render() {
        return (
            <Segment.Group>
                <Segment color="blue">
                    <Header>Latest Transactions</Header>
                </Segment>
                <Segment>
                    <Table basic='very' unstackable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Source</Table.HeaderCell>
                                <Table.HeaderCell>Target</Table.HeaderCell>
                                <Table.HeaderCell>Amount [CHF]</Table.HeaderCell>
                                <Table.HeaderCell>Balance [CHF]</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.props.transactions.map(
                                transaction => <TableItemLatest {...transaction}/>
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