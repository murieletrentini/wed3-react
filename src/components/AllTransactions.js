import React from 'react'
import {Container, Divider, Dropdown, Grid, Header, Segment, Table} from "semantic-ui-react";
import TableItemAll from "../presentationComponents/TableItemAll";
import {getTransactions} from "../api";


class AllTransactions extends React.Component {

    state = {
        transactions: [],
        year: 0,
        month: 0
    };

    monthOptions = [{key: 1, value: 1, text: 'January'}, {key: 2, value: 2, text: 'February'},
        {key: 3, value: 3, text: 'March'}, {key: 4, value: 4, text: 'April'},
        {key: 5, value: 5, text: 'May'}, {key: '6', value: '6', text: 'June'},
        {key: '7', value: '7', text: 'July'}, {key: '8', value: '8', text: 'August'},
        {key: '9', value: '9', text: 'September'}, {key: '10', value: '10', text: 'October'},
        {key: '11', value: '11', text: 'November'}, {key: '12', value: '12', text: 'December'}];

    yearOptions = [{key: 2016, value: 2016, text: '2016'},
        {key: 2017, value: 2017, text: '2017'},
        {key: 2018, value: 2018, text: '2018'}];

    handleYearChange = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState({login: event.target.value});
        }
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
                        <Header as='h2'>All Transactions</Header>
                    </Segment>
                    <Segment>
                        <Header as='h3'>Filter</Header>
                        <Grid columns={2} relaxed>
                            <Grid.Column>
                                <Segment basic>
                                    <Dropdown placeholder='Select Year' fluid search selection
                                              options={this.yearOptions} onChange="this.handleYearChange"/>
                                </Segment>
                            </Grid.Column>
                            <Divider vertical/>
                            <Grid.Column>
                                <Segment basic>
                                    <Dropdown placeholder='Select Month' fluid search selection
                                              options={this.monthOptions}/>
                                </Segment>
                            </Grid.Column>
                        </Grid>


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