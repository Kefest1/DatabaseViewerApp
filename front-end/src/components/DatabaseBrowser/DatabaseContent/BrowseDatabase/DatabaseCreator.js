import * as React from 'react';
import {useState} from "react";
import {TextField, Snackbar, IconButton, SnackbarContent, Button} from "@mui/material";
import {getCookie} from "../../../getCookie";
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';


function addDatabase(databaseName, databaseDescription, primaryColumnName, tableName) {
    if (databaseDescription === "") {
        databaseDescription = "No description";
    }

    const userName = getCookie("userName");
    const url = "http://localhost:8080/api/databaseinfo/add";

    const payload = {
        databaseName: databaseName,
        databaseDescription: databaseDescription,
        tableName: tableName,
        columnName: primaryColumnName,
        userName: userName
    };
    console.log(payload);

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then(response => {
            if (response.status === 200) {
                return response.text().then(message => ({
                    status: 200,
                    message,
                }));
            } else if (response.status === 201) {
                return response.text().then(message => ({
                    status: 201,
                    message,
                }));
            } else {
                return response.text().then(message => {
                    throw new Error(message);
                });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            throw error;
        });
}



function DatabaseCreator() {
    const [databaseName, setDatabaseName] = useState('');
    const [databaseDescription, setDatabaseDescription] = useState('');
    const [tableName, setTableName] = useState('');
    const [primaryColumnName, setPrimaryColumnName] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openSnackbarSuccess, setOpenSnackbarSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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

    const handleCloseSnackbarSuccess = () => {
        setOpenSnackbarSuccess(false);
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

        addDatabase(databaseName, databaseDescription, primaryColumnName, tableName)
            .then(({ status, message }) => {
                if (status === 201) {
                    setSuccessMessage('Database added successfully');
                    setOpenSnackbarSuccess(true);
                } else if (status === 200) {
                    setErrorMessage(`Database with that name already exists`);
                    setOpenSnackbar(true);
                }
            })
            .catch(error => {
                console.error('Failed to add database:', error.message);
                setErrorMessage(`Error: ${error.message}`);
                setOpenSnackbar(true);
            });
    };

    return (
        <div>
            <h6>Create a database</h6>
            <Box display="flex" alignItems="center" gap={1}>
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
            </Box>

            <Button variant="contained" onClick={handleSubmit} style={{marginTop: 5}}>
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
            <Snackbar
                open={openSnackbarSuccess}
                autoHideDuration={6000}
                onClose={handleCloseSnackbarSuccess}
            >
                <SnackbarContent
                    style={{ backgroundColor: '#117311' }}
                    message={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <ErrorIcon style={{ marginRight: 8 }} />
                            {successMessage}
                        </span>
                    }
                    action={[
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            onClick={handleCloseSnackbarSuccess}
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