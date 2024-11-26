import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
    randomCreatedDate,
    randomTraderName,
    randomId,
    randomArrayItem,
} from '@mui/x-data-grid-generator';
import {getCookie} from "../../../getCookie";
import {useEffect, useState} from "react";
import {TextField} from "@mui/material";

function addDatabase(databaseName, databaseDescription, tableName) {
    const url = `http://localhost:8080/api/databaseinfo/add/${databaseName}/${databaseDescription}`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return 0;
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function DatabaseCreator() {
    const [databaseName, setDatabaseName] = useState('');
    const [databaseDescription, setDatabaseDescription] = useState('');
    const [tableName, setTableName] = useState('');

    const handleInputChange = (event) => {
        setDatabaseName(event.target.value);
    };

    const handleInputDescriptionChange = (event) => {
        setDatabaseDescription(event.target.value);
    };

    const handleInputTableNameChange = (event) => {
        setTableName(event.target.value);
    };

    const handleSubmit = () => {
        addDatabase(databaseName, databaseDescription, tableName);
    };

    return (
        <div>
            <h1>Create a database</h1>
            <TextField
                id="outlined-basic"
                label="Database Name"
                variant="outlined"
                value={databaseName}
                onChange={handleInputChange}
            />
            <TextField
                id="outlined-basic"
                label="Table Name"
                variant="outlined"
                value={tableName}
                onChange={handleInputTableNameChange}
            />
            <TextField
                id="outlined-basic"
                label="DB description (optional)"
                variant="outlined"
                value={databaseDescription}
                onChange={handleInputDescriptionChange}
            />
            <br/>
            <Button variant="contained" onClick={handleSubmit}>
                Add database
            </Button>
        </div>
    );
}

export default DatabaseCreator;