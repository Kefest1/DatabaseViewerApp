import * as React from 'react';
import {useState} from "react";
import {TextField, Snackbar, IconButton, SnackbarContent, Button} from "@mui/material";
import {getCookie} from "../../../getCookie";
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';


function addDatabase(databaseName, databaseDescription, primaryColumnName, tableName) {
    if (databaseDescription === "") {
        databaseDescription = "No description";
    }
    const userName = getCookie("userName");
    const url = `http://localhost:8080/api/databaseinfo/add/${databaseName}/${tableName}/${primaryColumnName}/${databaseDescription}/${userName}`;

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
    const userName = getCookie("userName");

    const url = `http://localhost:8080/api/tableinfo/addFieldInfo/Long/${columnName}/${tableID}/${userName}`;
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

function addConnection(tableID) {
    const url = `http://localhost:8080/api/ownershipdetails/addbyusername/${tableID}`;

    const userName = getCookie("userName");
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: userName
    })
        .then(response => {
            if (response.ok) {
                console.log('User added successfully');
            } else {
                console.log('Error adding user');
            }
        })
        .catch(error => {
            console.error('Request failed', error);
        });
}


function DatabaseCreator() {
    const [databaseName, setDatabaseName] = useState('');
    const [databaseDescription, setDatabaseDescription] = useState('');
    const [tableName, setTableName] = useState('');
    const [primaryColumnName, setPrimaryColumnName] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

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

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const isValidName = (name) => {
        const regex = /^[A-Za-z_][A-Za-z0-9_]*$/;
        return regex.test(name) && name.length <= 63;
    };


    const handleSubmit = () => {
        if (databaseName === "" || tableName === "" || primaryColumnName === "") {
            setErrorMessage('Fill all necessary text fields');
            setOpenSnackbar(true);
            return;
        }

        if (!isValidName(databaseName)) {
            setErrorMessage('Invalid database name. Must start with a letter or underscore and contain only letters, digits, and underscores.');
            setOpenSnackbar(true);
            return;
        }

        if (!isValidName(tableName)) {
            setErrorMessage('Invalid table name. Must start with a letter or underscore and contain only letters, digits, and underscores.');
            setOpenSnackbar(true);
            return;
        }

        if (!isValidName(primaryColumnName)) {
            setErrorMessage('Invalid primary key column name. Must start with a letter or underscore and contain only letters, digits, and underscores.');
            setOpenSnackbar(true);
            return;
        }

        let databaseId;
        let tableID;

        addDatabase(databaseName, databaseDescription, primaryColumnName, tableName)

            .catch(error => {
                console.error('Failed to add database:', error);
                setErrorMessage('Failed to add database. Please try again.');
                setOpenSnackbar(true);
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
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <SnackbarContent
                    style={{ backgroundColor: '#f44336' }}
                    message={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <ErrorIcon style={{ marginRight: 8 }} />
                            {errorMessage}
                        </span>
                    }
                    action={[
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            onClick={handleCloseSnackbar}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </Snackbar>
        </div>
    );
}

export default DatabaseCreator;