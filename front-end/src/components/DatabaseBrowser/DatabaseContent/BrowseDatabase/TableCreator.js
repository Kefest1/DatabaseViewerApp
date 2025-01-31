import React, {useEffect, useState} from "react";
import Select from '@mui/material/Select';
import {
    InputLabel,
    MenuItem,
    TextField,
    FormControl,
    Grid2,
    SnackbarContent,
    IconButton,
    Snackbar
} from "@mui/material";
import {getCookie} from "../../../getCookie";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import {InfoIcon} from "lucide-react";

async function fetchAvailableDatabases() {
    const userName = getCookie("userName");

    const token = localStorage.getItem("jwtToken");
    const tables = await fetch(
        "http://localhost:8080/api/tableinfo/getAvailableDatabases/" + userName, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return await tables.json();
}



function TableCreator({setMessage, setOpenSnackbar}) {
    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [availableDatabases, setAvailableDatabases] = useState([]);

    const [tableName, setTableName] = useState('');
    const [primaryColumnName, setPrimaryColumnName] = useState('');

    const isValidName = (name) => {
        const regex = /^[A-Za-z_][A-Za-z0-9_]*$/;
        return regex.test(name) && name.length <= 63 && name.length >= 3;
    };

    function addTable(tableName, primaryColumnName, databaseName) {

        const url = `http://localhost:8080/api/tableinfo/addenhanced`;
        const userName = getCookie("userName");

        if (!isValidName(tableName)) {
            setMessage("Invalid table name, needs to be between 3 and 63 characters and start with a letter or underscore");
            setOpenSnackbar(true);
            return;
        }
        if (!isValidName(primaryColumnName)) {
            setMessage("Invalid primary key name, needs to be between 3 and 63 characters and start with a letter or underscore");
            setOpenSnackbar(true);
            return;
        }

        const payload = {
            tableName: tableName,
            primaryKey: primaryColumnName,
            databaseName: databaseName,
            username: userName
        };

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                console.log('Success:', data);
                setMessage(data);
                setOpenSnackbar(true);
                return data;
            })
            .catch(error => {
                console.error('Error:', error);
                throw error;
            });
    }

    const handleColumnName = (event) => {
        setPrimaryColumnName(event.target.value);
    };

    const handleInputTableNameChange = (event) => {
        setTableName(event.target.value);
    };

    const handleSubmit = () => {
        addTable(tableName, primaryColumnName, selectedDatabase);
    };

    useEffect(() => {
        const loadDatabases = async () => {
            const availableDBs = await fetchAvailableDatabases();
            setAvailableDatabases(availableDBs);
        };

        loadDatabases();
    }, []);

    return (
        <div>
            <h6>Table create</h6>
                <FormControl variant="outlined">
                    <InputLabel id="demo-simple-select-table">Select a Database</InputLabel>
                    <Select
                        labelId="demo-simple-select-table"
                        id="demo-simple-table"
                        value={selectedDatabase}
                        label="Select Table"
                        onChange={(event) => setSelectedDatabase(event.target.value)}
                        variant={"outlined"}
                        style={{width: "200px"}}
                    >
                        {availableDatabases.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

            {selectedDatabase !== "" && (
                <Box mt={1} display="flex" alignItems="center" gap={1}>
                    <TextField
                        id="outlined-basic"
                        label="Table Name"
                        variant="outlined"
                        value={tableName}
                        onChange={handleInputTableNameChange}
                    />

                    <TextField
                        id="outlined-basic"
                        label="Primary key Name"
                        variant="outlined"
                        value={primaryColumnName}
                        onChange={handleColumnName}
                    />

                    <Button variant="contained" onClick={handleSubmit}>
                        Add table
                    </Button>
                </Box>
            )}

        </div>
    );
}

export default TableCreator;
