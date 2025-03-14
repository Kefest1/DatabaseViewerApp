import React, {useEffect, useState} from "react";
import {getCookie} from "../../../getCookie";
import QueryLogger, {logging_level} from './QueryLogger';
import Select from '@mui/material/Select';
import {Button, FormControl, Grid2, InputLabel, MenuItem, OutlinedInput, Paper} from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import TableJoiner from "./TableJoiner";
import { useTransition, animated } from 'react-spring';

async function fetchAvailableDatabases(userName) {

    const token = localStorage.getItem("jwtToken");
    const response = await fetch(
        "http://localhost:8080/api/databaseinfo/getfoldermap/" + userName, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
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

    const token = localStorage.getItem("jwtToken");
    const response = await fetch(
        `http://localhost:8080/api/tableinfo/getColumns/${userName}/${database}/${table}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return await response.json();
}

async function fetchPrimaryKeyName(database, table) {
    const url = `http://localhost:8080/api/tableinfo/getKey/${database}/${table}/${getCookie("userName")}`

    const token = localStorage.getItem("jwtToken");
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await response.text();
}

async function runQuery(database, table, columns) {
    try {
        const requestBody = { database, table, columns: [...columns] };
        const token = localStorage.getItem("jwtToken");

        const url = `http://localhost:8080/api/tableinfo/getAllFields/${getCookie("userName")}`;
        const startTime = performance.now();
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestBody)
        });
        const endTime = performance.now();
        const fetchTime = endTime - startTime;
        QueryLogger.addLog(`Fetched data for table ${table} in database ${database}`, logging_level.SELECT);

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
    let info;
    info = ["", ""];
    if (selectedDbTable) {
        info = selectedDbTable.split(",");
    }

    const [availableDatabases, setAvailableDatabases] = useState([]);
    const [selectedDatabase, setSelectedDatabase] = useState(info[0]);
    const [selectedTable, setSelectedTable] = useState(info[1]);
    const [tablesForSelectedDatabase, setTablesForSelectedDatabase] = useState([]);
    const [availableColumns, setAvailableColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [isButtonPressed, setIsButtonPressed] = useState(false);
    const [queryResult, setQueryResult] = useState([]);

    const [primaryKeyName, setPrimaryKeyName] = useState("");

    const [tableBrowserKey, setTableBrowserKey] = useState(0);

    const userName = getCookie("userName");

    function handleSelectOne(event) {
        setSelectedDatabase(event.target.value);
    }

    function handleSelectTwo(event) {
        setSelectedTable(event.target.value);
    }

    function handleSelectThree(event) {
        setSelectedColumns(event.target.value);
    }

    useEffect(() => {
        if (selectedDatabase) {

            const token = localStorage.getItem("jwtToken");
            fetch(
                `http://localhost:8080/api/tableinfo/getTables/${userName}/${selectedDatabase}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            )
                .then((response) => response.json())
                .then((data) => setTablesForSelectedDatabase(data))
                .catch((error) =>
                    console.error("Error fetching tables for the selected database:", error)
                );
        }
    }, [userName, selectedDatabase]);

    useEffect(() => {
        setAvailableColumns([]);
        setSelectedColumns([]);
        if (selectedTable) {
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
        }
    }, [availableColumns]);

    useEffect(() => {
        setIsButtonPressed(false);
        setAvailableColumns([]);
        setSelectedColumns([]);
    }, [selectedDatabase]);

    useEffect(() => {
        setIsButtonPressed(false);

        if (selectedDatabase && selectedTable) {
            fetchPrimaryKeyName(selectedDatabase, selectedTable)
                .then((response) => {
                    setPrimaryKeyName(response);
                })
                .catch((error) =>
                    console.error("Error fetching columns for the selected table:", error)
                );
        }
    }, [selectedDatabase, selectedTable]);

    useEffect(() => {
        fetchAvailableDatabases(userName)
            .then(({ databases, columnsByDatabase }) => {
                setAvailableDatabases(databases);
            })
            .catch((error) => console.error("Error fetching databases:", error));
    }, [userName, selectedDbTable]);

    const transitions = useTransition(selectedDatabase, {
        from: {opacity: 0, transform: 'translateY(-20px)'},
        enter: {opacity: 1, transform: 'translateY(0)'},
        leave: {opacity: 0, transform: 'translateY(-20px)'},
    });

    return (
        <Paper sx={{ width: 'calc(80vw)', height: 'calc(86vh)', overflow: 'auto' }} elevation={3} style={{ padding: '10px', margin: '10px', borderRadius: '8px' }}>


        <Grid2 container direction="column" alignItems="flex-start" spacing={2} style={{marginTop: '12px'}}>
            <Grid2 item>
                <Grid2 container spacing={2} alignItems="center" direction="row">
                    <Grid2 item>
                        <FormControl variant="outlined">
                            <InputLabel id="demo-simple-select-label">Select a Database</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedDatabase}
                                onChange={handleSelectOne}
                                variant={"outlined"}
                                style={{ width: '175px' }}
                            >
                                {availableDatabases.map((option, index) => (
                                    <MenuItem key={index} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>

                    {transitions(
                        (style, item) =>
                            item && (
                                <animated.div style={style}>
                                    <Grid2 item>
                                        <FormControl variant="outlined">
                                            <InputLabel id="demo-simple-select-table">Select Table</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-table"
                                                id="demo-simple-table"
                                                value={selectedTable}
                                                onChange={handleSelectTwo}
                                                variant={"outlined"}
                                                style={{ width: '125px' }}
                                            >
                                                {tablesForSelectedDatabase.map((option, index) => (
                                                    <MenuItem key={index} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid2>
                                </animated.div>
                            )
                    )}

                    {selectedTable && (
                        <Grid2 item>
                            <FormControl variant="outlined">
                                <InputLabel id="demo-multiple-checkbox-label">Select Columns</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={selectedColumns}
                                    onChange={handleSelectThree}
                                    input={<OutlinedInput label="Select Columns"/>}
                                    renderValue={(selected) => selected.join(', ')}
                                    variant={"outlined"}
                                    style={{ width: '175px' }}
                                >
                                    {availableColumns.map((name) => (
                                        <MenuItem key={name} value={name}>
                                            <Checkbox checked={selectedColumns.includes(name)}/>
                                            <ListItemText primary={name}/>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid2>
                    )}

                    {selectedTable && selectedColumns.length > 0 && (
                        <Grid2 item>
                            <Button
                                className="button button-insert"
                                size={"large"}
                                variant="contained"
                                style={{marginLeft: 16}}
                                onClick={() => {
                                    runQuery(selectedDatabase, selectedTable, selectedColumns)
                                        .then(result => {
                                            setQueryResult(result);
                                            setIsButtonPressed(true);
                                            setTableBrowserKey(prevKey => prevKey + 1);
                                        })
                                        .catch(error => {
                                            console.error(error);
                                        });
                                }}
                            >
                                Fetch Data
                            </Button>
                        </Grid2>
                    )}
                </Grid2>
            </Grid2>

            {isButtonPressed && (
                <Grid2 item style={{marginTop: '16px'}}>
                    <TableJoiner
                        key={tableBrowserKey}
                        data={queryResult.result}
                        fetchTime={-1}
                        tableName={selectedTable}
                        databaseName={selectedDatabase}
                        selectedColumns={selectedColumns}
                        primaryKey={primaryKeyName}
                    />
                </Grid2>
            )}
        </Grid2>
        </Paper>
    );

};

export default QueryTool;
