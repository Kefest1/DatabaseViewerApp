import React, {useEffect, useState} from "react";
import Select from '@mui/material/Select';
import {MenuItem} from "@mui/material";
import {getCookie} from "../../../getCookie";
import DataGridTable from "./DataGridTable";
import DatabaseCreator from "./DatabaseCreator";

async function fetchAvailableDatabases() {
    const userName = getCookie("userName");
    const tables = await fetch(
        "http://localhost:8080/api/tableinfo/getAvailableDatabases/" + userName
    );
    return await tables.json();
}

async function fetchAvailableTables(selectedDatabase) {
    const userName = getCookie("userName");
    const url = "http://localhost:8080/api/tableinfo/getAvailableTables/" + userName + "/" + selectedDatabase;
    const tables = await fetch(url);
    return await tables.json();
}


function TableCreator() {
    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [selectedTable, setSelectedTable] = useState("");

    const [availableTables, setAvailableTables] = useState([]);
    const [availableDatabases, setAvailableDatabases] = useState([]);

    useEffect(() => {
        const loadDatabases = async () => {
            const availableDBs = await fetchAvailableDatabases();
            setAvailableDatabases(availableDBs);
        };

        loadDatabases();
    }, []);

    useEffect(() => {
        const loadTables = async () => {
            if (selectedDatabase) { // Check if selectedDatabase is not an empty string
                const availableTables = await fetchAvailableTables(selectedDatabase);
                setAvailableTables(availableTables);
            } else {
                setAvailableTables([]); // Clear available tables if no database is selected
            }
        };

        loadTables();
    }, [selectedDatabase]); // Make sure to include selectedDatabase in the dependency array


    return (
        <div>
            <h1>Table create</h1>
            <DatabaseCreator/>
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
            {
                selectedDatabase !== "" &&
                (
                    <Select
                    labelId="demo-simple-select-table"
                    id="demo-simple-table"
                    value={selectedTable}
                    label="Select Table"
                    onChange={(event) => setSelectedTable(event.target.value)}
                    variant={"outlined"}
                    >
                    {availableTables.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                    </Select>
                )
            }
            {
                selectedTable !== "" && selectedDatabase !== "" &&
                (
                    <DataGridTable databaseName={selectedDatabase} selectedTable={selectedTable}></DataGridTable>
                )
            }
        </div>
    )
}

export default TableCreator;
