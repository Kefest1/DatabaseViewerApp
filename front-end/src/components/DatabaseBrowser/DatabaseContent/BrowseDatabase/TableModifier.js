import {FormControl, InputLabel, MenuItem} from "@mui/material";
import Select from "@mui/material/Select";
import DataGridTable from "./DataGridTable";
import React, {useEffect, useState} from "react";
import {getCookie} from "./../../../getCookie";
import Button from "@mui/material/Button";

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

async function fetchAvailableTables(selectedDatabase) {
    const userName = getCookie("userName");
    const url = "http://localhost:8080/api/tableinfo/getAvailableTables/" + userName + "/" + selectedDatabase;

    const token = localStorage.getItem("jwtToken");
    const tables = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return await tables.json();
}


async function fetchPrimaryKeyName(database, table) {
    const url = `http://localhost:8080/api/tableinfo/getKey/${database}/${table}/${getCookie("userName")}`

    const token = localStorage.getItem("jwtToken");
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return await response.text();
}


function TableModifier({setMessage, setOpenSnackbar}) {
    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [selectedTable, setSelectedTable] = useState("");

    const [availableTables, setAvailableTables] = useState([]);
    const [availableDatabases, setAvailableDatabases] = useState([]);

    const [isButtonPressed, setIsButtonPressed] = useState(false);

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

    useEffect(() => {
        setIsButtonPressed(false);
    }, [selectedDatabase, selectedTable]);

    return (
        <div>
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
                    style={{width: "200px", marginRight: "10px"}}
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
                        style={{marginRight: "10px"}}
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
                    <Button
                        onClick={() => setIsButtonPressed(true)}
                        variant={"contained"}
                    >
                        Fetch data
                    </Button>
                )
            }
            {
                selectedTable !== "" && selectedDatabase !== "" && isButtonPressed === true &&
                (
                    <DataGridTable databaseName={selectedDatabase} selectedTable={selectedTable}></DataGridTable>
                )
            }
        </div>
    );
}

export default TableModifier;
