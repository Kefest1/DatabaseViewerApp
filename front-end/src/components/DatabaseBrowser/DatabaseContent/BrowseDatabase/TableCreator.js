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

const actions = [
    "Add new table",
    "Modify Table",
];

function TableCreator() {
    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [availableDatabases, setAvailableDatabases] = useState([]);

    useEffect(() => {
        const loadDatabases = async () => {

            const availableDBs = await fetchAvailableDatabases();
            setAvailableDatabases(availableDBs);

        };

        loadDatabases();
    }, []);


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
                    <DataGridTable databaseName={selectedDatabase}></DataGridTable>
                )
            }
        </div>
    )
}

export default TableCreator;
