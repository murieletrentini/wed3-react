import React from 'react'
import {Container, Divider, Dropdown, Grid, Header, Segment, Table} from "semantic-ui-react";
import TableItemAll from "../presentationComponents/TableItemAll";
import {getTransactions} from "../api";


class AllTransactions extends React.Component {

    state = {
        transactions: [],
        year: new Date().getFullYear(),
        month: new Date().getMonth()
    };

    monthOptions = [{key: 0, value: 0, text: 'January'}, {key: 1, value: 1, text: 'February'},
        {key: 2, value: 2, text: 'March'}, {key: 3, value: 3, text: 'April'},
        {key: 4, value: 4, text: 'May'}, {key: 5, value: 5, text: 'June'},
        {key: 6, value: 6, text: 'July'}, {key: 7, value: 7, text: 'August'},
        {key: 8, value: 8, text: 'September'}, {key: 9, value: 9, text: 'October'},
        {key: 10, value: 10, text: 'November'}, {key: 11, value: 11, text: 'December'}];

    yearOptions = [{key: 2016, value: 2016, text: '2016'},
        {key: 2017, value: 2017, text: '2017'},
        {key: 2018, value: 2018, text: '2018'}];

    handleYearChanged = (event: SyntheticEvent, data: object) => {
        this.updateTransactions({year: data.value, month: this.state.month})
    };
    handleMonthChanged = (event: SyntheticEvent, data: object) => {
        this.updateTransactions({year: this.state.year, month: data.value})
    };

    componentDidMount() {
        this.updateTransactions({year: this.state.year, month: this.state.month});
    }

    //TODO: add page parameter to get the next 10 entries
    updateTransactions = ({year, month}) => {
        this.setState({month: month, year: year});
        let from = new Date(Date.UTC(year, month));
        let to = new Date(Date.UTC(year, month+1, 0));
        getTransactions(this.props.token, from, to, 10, 0)
            .then(result => {
                console.log("transactions ", result.result);
                this.setState({transactions: result.result});
            })
            .catch(error => this.setState({error}));
    };

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
                                              options={this.yearOptions} defaultValue={this.state.year}
                                              onChange={this.handleYearChanged}/>
                                </Segment>
                            </Grid.Column>
                            <Divider vertical/>
                            <Grid.Column>
                                <Segment basic>
                                    <Dropdown placeholder='Select Month' fluid search selection
                                              options={this.monthOptions} defaultValue={this.state.month}
                                              onChange={this.handleMonthChanged}/>
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