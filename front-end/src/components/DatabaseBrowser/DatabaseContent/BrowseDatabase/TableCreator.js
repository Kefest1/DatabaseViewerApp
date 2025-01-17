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
    const tables = await fetch(
        "http://localhost:8080/api/tableinfo/getAvailableDatabases/" + userName
    );
    return await tables.json();
}



function TableCreator() {
    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [availableDatabases, setAvailableDatabases] = useState([]);

    const [tableName, setTableName] = useState('');
    const [primaryColumnName, setPrimaryColumnName] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("");

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    function addTable(tableName, primaryColumnName, databaseName) {
        const url = `http://localhost:8080/api/tableinfo/addenhanced`;
        const userName = getCookie("userName");


        const data = new URLSearchParams();
        data.append('tableName', tableName);
        data.append('username', userName);
        data.append('databaseName', databaseName);
        data.append('primaryKey', primaryColumnName);

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data.toString()
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

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <SnackbarContent
                    style={{ backgroundColor: '#f44336' }}
                    message={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <InfoIcon style={{ marginRight: 8 }} />
                            {message}
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

export default TableCreator;
