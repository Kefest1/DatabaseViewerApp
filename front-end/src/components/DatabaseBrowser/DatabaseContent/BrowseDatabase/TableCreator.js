import React, {useEffect, useState} from "react";
import Select from '@mui/material/Select';
import {MenuItem, TextField} from "@mui/material";
import {getCookie} from "../../../getCookie";
import DataGridTable from "./DataGridTable";
import DatabaseCreator from "./DatabaseCreator";
import Button from "@mui/material/Button";

async function fetchAvailableDatabases() {
    const userName = getCookie("userName");
    const tables = await fetch(
        "http://localhost:8080/api/tableinfo/getAvailableDatabases/" + userName
    );
    return await tables.json();
}

function addTable(tableName, primaryColumnName, databaseName) {
    const url = `http://localhost:8080/api/tableinfo/addenhanced`;
    const userName = getCookie("userName");

    console.log(tableName);
    console.log(primaryColumnName);
    console.log(databaseName);

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
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

function TableCreator() {
    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [availableDatabases, setAvailableDatabases] = useState([]);

    const [tableName, setTableName] = useState('');
    const [primaryColumnName, setPrimaryColumnName] = useState('');

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
            <Select
                labelId="demo-simple-select-table"
                id="demo-simple-table"
                value={selectedDatabase}
                label="Select Table"
                onChange={(event) => setSelectedDatabase(event.target.value)}
                variant={"outlined"}
            >
                {availableDatabases.map((option, index) => (
                    <MenuItem key={index} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>

            {selectedDatabase !== "" && (
                <div>
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

                </div>
            )}
        </div>
    );
}

export default TableCreator;
