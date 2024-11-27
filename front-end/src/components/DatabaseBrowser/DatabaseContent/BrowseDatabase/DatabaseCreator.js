import * as React from 'react';
import Button from '@mui/material/Button';
import {useState} from "react";
import {TextField} from "@mui/material";

function addDatabase(databaseName, databaseDescription) {
    const url = `http://localhost:8080/api/databaseinfo/add/${databaseName}/${databaseDescription}`;

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            console.log('Success:', data);
            return data; // Return the Long value from the response
        })
        .catch(error => {
            console.error('Error:', error);
            throw error; // Re-throw the error if you want to handle it later
        });
}

function addTable(tableName, databaseID, primaryColumnName) {
    const url = `http://localhost:8080/api/tableinfo/add`;

    const data = new URLSearchParams();
    data.append('tableInfo', tableName);
    data.append('databaseID', databaseID);
    data.append('primaryKey', primaryColumnName);

    console.log(data);

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

function addStructure(columnName, tableID) {
    const url = `http://localhost:8080/api/tableinfo/addFieldInfo/Long/${columnName}/${tableID}`;
    console.log(columnName);
    console.log(tableID);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
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
    const [primaryColumnName, setPrimaryColumnName] = useState('');

    const handleColumnName = (event) => {
        setPrimaryColumnName(event.target.value);
    };

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
        let databaseId; // Declare a variable to hold the result
        let tableID; // Declare a variable to hold the result

        addDatabase(databaseName, databaseDescription)
            .then(id => {
                databaseId = id;

                addTable(tableName, databaseId, primaryColumnName)
                    .then(id => {
                        tableID = id; // Assign the result to the variable
                        addStructure(primaryColumnName, tableID);
                    })
                    .catch(error => {
                        console.error('Failed to add database:', error);
                    });
            })
            .catch(error => {
                console.error('Failed to add database:', error);
            });
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
                label="Primary key column name"
                variant="outlined"
                value={primaryColumnName}
                onChange={handleColumnName}
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