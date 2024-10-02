import React, {useEffect, useState} from "react";
import {getCookie} from "../../../getCookie";
import Button1DbContent from "./Button1DbContent";
import QueryLogger from './QueryLogger';
import Select from '@mui/material/Select';
import {Button, FormControl, InputLabel, MenuItem, OutlinedInput} from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

async function fetchAvailableDatabases(userName) {
    const response = await fetch(
        "http://localhost:8080/api/databaseinfo/getfoldermap/" + userName
    );
    const data = await response.json();
    const databases = extractDatabaseNames(data);
    const columnsByDatabase = {};

    data.forEach((entry) => {
        const [database, table, column] = entry.split(",", 3);
        if (database && table && column) {
            if (!columnsByDatabase[database]) {
                columnsByDatabase[database] = [];
            }
            columnsByDatabase[database].push(column);
        }
    });

    return { databases, columnsByDatabase };
}

function extractDatabaseNames(data) {
    const databaseNames = new Set();

    data.forEach((entry) => {
        const parts = entry.split(",");
        if (parts.length >= 1) {
            databaseNames.add(parts[0]);
        }
    });

    return Array.from(databaseNames);
}

async function fetchColumnsForTable(userName, database, table) {
    const response = await fetch(
        `http://localhost:8080/api/tableinfo/getColumns/${userName}/${database}/${table}`
    );
    return await response.json();
}

async function runQuery(database, table, columns) {
    console.log(`Database: ${database}`);
    console.log(`Table: ${table}`);
    console.log(`Columns: ${columns}`);

    try {
        const requestBody = { database, table, columns: [...columns] };

        console.log(JSON.stringify(requestBody));
        const url = 'http://localhost:8080/api/tableinfo/getAllFields';
        const startTime = performance.now();
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        const endTime = performance.now();
        const fetchTime = endTime - startTime;

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.json();
        return { result, fetchTime };
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return null;
    }
}



const QueryTool = ({selectedDbTable}) => {
    const [availableDatabases, setAvailableDatabases] = useState([]);
    const [columnsByDatabase, setColumnsByDatabase] = useState([]);
    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [selectedTable, setSelectedTable] = useState("");
    const [tablesForSelectedDatabase, setTablesForSelectedDatabase] = useState([]);
    const [availableColumns, setAvailableColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [isButtonPressed, setIsButtonPressed] = useState(false);
    const [queryResult, setQueryResult] = useState([]);

    const userName = getCookie("userName");

    let info;
    if (selectedDbTable) {
        info = selectedDbTable.split(",");
    }
    else {
        info = ["", ""];
    }

    function handleSelectOne(event) {
        setSelectedDatabase(event.target.value);
    }

    function handleSelectTwo(event) {
        setSelectedTable(event.target.value);
    }

    function handleSelectThree(event) {
        setSelectedColumns(event.target.value);
    }

    const handleButtonPress = () => {
        setIsButtonPressed(!isButtonPressed);
    };

    useEffect(() => {
        if (selectedDatabase) {
            fetch(
                `http://localhost:8080/api/tableinfo/getTables/${userName}/${selectedDatabase}`
            )
                .then((response) => response.json())
                .then((data) => setTablesForSelectedDatabase(data))
                .catch((error) =>
                    console.error("Error fetching tables for the selected database:", error)
                );
        }
    }, [userName, selectedDatabase, columnsByDatabase]);

    useEffect(() => {
        if (selectedTable) {
            console.log("SRAKEN");
            fetchColumnsForTable(userName, selectedDatabase, selectedTable)
                .then((response) => {
                    setAvailableColumns(response);
                })
                .catch((error) =>
                    console.error("Error fetching columns for the selected table:", error)
                );
        }
    }, [selectedDatabase, selectedTable, userName]);

    useEffect(() => {
        if (availableColumns.length > 0) {
            setSelectedColumns(availableColumns);
            console.log(availableColumns);
        }
    }, [availableColumns]);

    useEffect(() => {
        fetchAvailableDatabases(userName)
            .then(({ databases, columnsByDatabase }) => {
                setAvailableDatabases(databases);
                setColumnsByDatabase(columnsByDatabase);
            })
            .catch((error) => console.error("Error fetching databases:", error));
    }, [userName, selectedDbTable]);


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedDatabase}
                    label="Select Option"
                    onChange={handleSelectOne}
                    variant={"outlined"}
                >
                    {availableDatabases.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
                {selectedDatabase && (
                    <Select
                        labelId="demo-simple-select-table"
                        id="demo-simple-table"
                        value={selectedTable}
                        label="Select Table"
                        onChange={handleSelectTwo}
                        variant={"outlined"}
                    >
                        {tablesForSelectedDatabase.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                )}
                {selectedTable && (
                    <div>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="demo-multiple-checkbox-label">All columns selected by default!</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={selectedColumns}
                                onChange={handleSelectThree}
                                input={<OutlinedInput label="All columns selected by default!" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {selectedColumns.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={selectedColumns.includes(name)} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" style={{ marginLeft: 16 }}
                                onClick={() => {
                                    runQuery(selectedDatabase, selectedTable, selectedColumns)
                                        .then(result => {
                                            setQueryResult(result);
                                            handleButtonPress();
                                        })
                                        .catch(error => {
                                            console.error(error);
                                        });
                                }}
                        >
                            Contained
                        </Button>
                    </div>
                )}
            </div>
            {isButtonPressed && (
                <div style={{ marginTop: '16px' }}>  {/* Adds space between the button and Button1DbContent */}
                    <Button1DbContent
                        data={queryResult.result}
                        fetchTime={-1}
                        tableName={selectedTable}
                        databaseName={selectedDatabase}
                        selectedColumns={selectedColumns}
                    />
                </div>
            )}
        </div>
    );

};

export default QueryTool;
