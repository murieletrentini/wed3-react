import React from 'react'
import {Table} from "semantic-ui-react";

const TableItemAll = ({date, from, target, amount, total}) => (
    <Table.Row>
        <Table.Cell>{new Intl.DateTimeFormat('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date(date))}</Table.Cell>
        <Table.Cell>{from}</Table.Cell>
        <Table.Cell>{target}</Table.Cell>
        <Table.Cell>{amount}</Table.Cell>
        <Table.Cell>{total}</Table.Cell>
    </Table.Row>
);

export default TableItemAll