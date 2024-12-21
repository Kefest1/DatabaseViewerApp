import React, {useEffect, useState} from "react";
import Select from '@mui/material/Select';
import {MenuItem} from "@mui/material";
import {getCookie} from "../../../getCookie";
import DataGridTable from "./DataGridTable";
import DatabaseCreator from "./DatabaseCreator";
import TableCreator from "./TableCreator";
import DatabaseModifier from "./DatabaseModifier";

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

function StructureModifier() {
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
            if (selectedDatabase) {
                const availableTables = await fetchAvailableTables(selectedDatabase);
                setAvailableTables(availableTables);
            } else {
                setAvailableTables([]);
            }
        };

        loadTables();
    }, [selectedDatabase]);


    return (
        <div>
            <h1>Database create</h1>
            <DatabaseCreator/>
            <h1>Table create</h1>
            <TableCreator/>
            <h1>Modify database structure</h1>
            <DatabaseModifier/>
            <h1>Modify table structure</h1>

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

export default StructureModifier;
