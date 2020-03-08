import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {DataTypeProvider,EditingState,} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,
} from '@devexpress/dx-react-grid-material-ui';
import {updateIngridient, deleteIngridient, newIngridient} from "./DbActions"
import Command from "./Command"

export default function Ingridients(props) {
    const [rows, setRows] = useState(props.ingridients);
    const [recs, setRecs] = useState(props.recipes);
    const [booleanColumns] = useState(['rec_id']);
    const [editingStateColumnExtensions] = useState([
        { columnName: 'ing_id', editingEnabled: false },
    ]);
    useEffect(() => {

        setRows(props.ingridients);
        setRecs(props.recipes);
    })

    const BooleanEditor = ({ value, onValueChange }) => (
        <Select
            input={<Input />}
            value={value!=undefined ? value : ''}
            onChange={event => {onValueChange(event.target.value)}}
            style={{ width: '100%' }}
        >
            {
                props.recipes.map(((rec, i) =>  (<MenuItem key ={i} value={rec.rec_id} name={rec.name}>
                    {rec.name}
                </MenuItem>)))
            }

        </Select>
    );
    const BooleanFormatter = ({ value }) => <span>{props.recipes.find(rec => rec.rec_id==value)?.name}</span>;

    const BooleanTypeProvider = props => (
        <DataTypeProvider
            formatterComponent={BooleanFormatter}
            editorComponent={BooleanEditor}
            {...props}
        />
    );
    const commitChanges = ({ added, changed, deleted }) => {
        let changedRows;
        if (added) {
            const startingAddedId = rows.length > 0 ? rows.length  : 0;
            changedRows = [
                ...rows,
                ...added.map((row, index) => ({
                    //id: startingAddedId + index,
                    rec_id: props.recipes.find(rec => rec.rec_id==row.rec_id)?.rec_id || false,

                    ...row,
                })),
            ];

            const newIngr=changedRows[startingAddedId]
            newIngridient(newIngr)
        }
        if (changed) {

            changedRows = rows.map((row,i) => (changed[i] ? { ...row, ...changed[i] } : row));
            const chagedIngridient = changedRows
                .find((row,i) => changed[i]!=undefined ? { ...row, ...changed[i] } : null);
            updateIngridient(chagedIngridient)

        }
        if (deleted) {
            const deletedSet = new Set(deleted);
            changedRows = rows.filter((row,i) => !deletedSet.has(i));
            const deletedRow =  rows[deleted[0]].ing_id
            deleteIngridient(deletedRow)

        }
        setRows(changedRows);
    };

    return (
        rows &&
        <Paper><Grid
            rows={rows}
            columns={[
                {name: 'ing_id', title: 'ID'},
                {name: 'name', title: 'Название'},
                {name: 'rec_id', title: 'Ссылка на Рецепт'},
                {name: 'units', title: 'Единицы измерения'},
            ]}>
            <BooleanTypeProvider
                for={booleanColumns}
            />
            <EditingState
                onCommitChanges={commitChanges}
                columnExtensions={editingStateColumnExtensions}
            />
            <Table/>
            <TableHeaderRow/>
            <TableEditRow />
            <TableEditColumn

                showAddCommand
                showEditCommand
                showDeleteCommand
                commandComponent = {Command}

            />
        </Grid></Paper>)
}
