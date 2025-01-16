import React, {useEffect, useState} from "react";
import Select from '@mui/material/Select';
import {FormControl, InputLabel, MenuItem} from "@mui/material";
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
            <h6>Structure modifier</h6>
            <DatabaseCreator/>
            <h6>Table create</h6>
            <TableCreator/>
            <h6>Modify database structure</h6>
            <DatabaseModifier/>
            <h6>Modify table structure</h6>
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
