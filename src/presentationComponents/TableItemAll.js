import React from 'react'
import {Table} from "semantic-ui-react";

//TODO: add key to get rid of warning
const TableItemAll = ({date, from, target, amount, total}) => (
    <Table.Row>
        <Table.Cell>{date}</Table.Cell>
        <Table.Cell>{from}</Table.Cell>
        <Table.Cell>{target}</Table.Cell>
        <Table.Cell>{amount}</Table.Cell>
        <Table.Cell>{total}</Table.Cell>
    </Table.Row>
);

export default TableItemAll