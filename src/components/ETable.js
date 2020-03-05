import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
    DataTypeProvider,
    EditingState,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,
} from '@devexpress/dx-react-grid-material-ui';

export default function ETable(props) {
    const [rows, setRows] = useState(props.ingridients);
    const commitChanges = ({ added, changed, deleted }) => {
        let changedRows;
        if (added) {
            /*const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
            changedRows = [
                ...rows,
                ...added.map((row, index) => ({
                    id: startingAddedId + index,
                    ...row,
                })),
            ];*/
        }
        if (changed) {

            changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
            console.log(changed, changedRows)
        }
        if (deleted) {
            const deletedSet = new Set(deleted);
            //changedRows = rows.filter(row => !deletedSet.has(row.id));
        }
        setRows(changedRows);
    };

    return (
        rows &&
        <Paper><Grid
            rows={rows}
            columns={[
                {name: 'name', title: 'Ингридиент'},
                {name: 'quantity', title: 'Кол-во'},
                {name: 'units', title: ''},
            ]}>
            <EditingState
                onCommitChanges={commitChanges}
                defaultEditingRowIds={[0]}
            />
            <Table/>
            <TableHeaderRow/>
            <TableEditRow />
            <TableEditColumn
                showAddCommand
                showEditCommand
                showDeleteCommand
            />
        </Grid></Paper>)
}
