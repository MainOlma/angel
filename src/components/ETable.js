import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

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
import {updateComposition, newComposition, deleteComposition} from "./DbActions"
const styles = theme => ({
    lookupEditCell: {
        padding: theme.spacing(1),
    },
    dialog: {
        width: 'calc(100% - 16px)',
    },
    inputRoot: {
        width: '100%',
    },
    selectMenu: {
        position: 'absolute !important',
    },
});

const AddButton = ({ onExecute }) => (
    <div style={{ textAlign: 'center' }}>
        <Button
            color="primary"
            onClick={onExecute}
            title="Create new row"
        >
            New
        </Button>
    </div>
);

const EditButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Edit row">
        <EditIcon />
    </IconButton>
);

const DeleteButton = ({ onExecute }) => (
    <IconButton
        onClick={() => {
            // eslint-disable-next-line
            if (window.confirm('Are you sure you want to delete this row?')) {
                onExecute();
            }
        }}
        title="Delete row"
    >
        <DeleteIcon />
    </IconButton>
);

const CommitButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Save changes">
        <SaveIcon />
    </IconButton>
);

const CancelButton = ({ onExecute }) => (
    <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
        <CancelIcon />
    </IconButton>
);

const commandComponents = {
    add: AddButton,
    edit: EditButton,
    delete: DeleteButton,
    commit: CommitButton,
    cancel: CancelButton,
};

const Command = ({ id, onExecute }) => {
    const CommandButton = commandComponents[id];
    return (
        <CommandButton
            onExecute={onExecute}
        />
    );
};



export default function ETable(props) {
    const [rows, setRows] = useState(props.ingridients);
    const [addIngId, setAddIngId] = useState(null);
    const [booleanColumns] = useState(['ing_id']);
    const [editingStateColumnExtensions] = useState([
        { columnName: 'units', editingEnabled: false },
    ]);

    const BooleanEditor = ({ value, onValueChange }) => (
        <Select
            input={<Input />}
            value={value!=undefined ? value : ''}
            onChange={event => {console.log("EVENT _________",event);onValueChange(event.target.value); setAddIngId(event.currentTarget.dataset.tag)}}
            style={{ width: '100%' }}
            disabled = {value!=undefined ? true : false}
        >
            {
                props.allIngridients.map(((ing, i) =>  (<MenuItem key ={i} data-tag={ing.ing_id} value={ing.ing_id} name={ing.name}>
                        {ing.name}
                </MenuItem>)))
            }

        </Select>
    );
    const BooleanFormatter = ({ value }) => <span>{props.allIngridients.find(ing => ing.ing_id==value).name}</span>;

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
            const startingAddedId = rows.length > 0 ? rows[rows.length]  : 0;
            changedRows = [
                ...rows,
                ...added.map((row, index) => ({
                    //id: startingAddedId + index,
                    name: props.allIngridients.find(ing => ing.ing_id==row.ing_id).name,
                    units: props.allIngridients.find(ing => ing.ing_id==row.ing_id).units,

                    ...row,
                })),
            ];

            const newIngridient={
                rec_id: props.currentRec,
                ing_id: added[0].ing_id,
                quantity: added[0].quantity
            };
            newComposition(newIngridient)
        }
        if (changed) {

            changedRows = rows.map((row,i) => (changed[i] ? { ...row, ...changed[i] } : row));
            const chagedIngridient = changedRows.find((row,i) => (changed[i] ? { ...row, ...changed[i] } : row))
            updateComposition(chagedIngridient)

        }
        if (deleted) {
            const deletedSet = new Set(deleted);
            changedRows = rows.filter((row,i) => !deletedSet.has(i));
            const deletedRow =  rows[deleted[0]].comp_id
            deleteComposition(deletedRow)

        }
        setRows(changedRows);
    };

    return (
        rows &&
        <Paper><Grid
            rows={rows}
            columns={[
                {name: 'ing_id', title: 'Ингридиент'},
                {name: 'quantity', title: 'Кол-во'},
                {name: 'units', title: ''},
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
