import React, {useEffect, useState} from "react";
import {getCookie} from "../../../getCookie";
import QueryLogger from './QueryLogger';
import Select from '@mui/material/Select';
import {Button, FormControl, Grid2, InputLabel, MenuItem, OutlinedInput, Paper} from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import TableBrowserNew from "./TableBrowserNew";
import { useTransition, animated } from 'react-spring';

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

async function fetchPrimaryKeyName(database, table) {
    const url = `http://localhost:8080/api/tableinfo/getKey/${database}/${table}`
    const response = await fetch(url);
    return await response.text();
}

async function fetchTableStructure(database, table) {
    const userName = getCookie("userName");
    const url = `http://localhost:8080/api/tableinfo/getColumnsWithTypes/${userName}/${database}/${table}`
    const response = await fetch(url);
    return await response.json();
}

async function runQuery(database, table, columns) {
    try {
        const requestBody = { database, table, columns: [...columns] };

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

const QueryTool = ({setData, setOccupiedTableInfo}) => {
    const [availableDatabases, setAvailableDatabases] = useState([]);
    const [columnsByDatabase, setColumnsByDatabase] = useState([]);
    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [selectedTable, setSelectedTable] = useState("");
    const [tablesForSelectedDatabase, setTablesForSelectedDatabase] = useState([]);
    const [availableColumns, setAvailableColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [isButtonPressed, setIsButtonPressed] = useState(false);
    const [queryResult, setQueryResult] = useState([]);

    const [primaryKeyName, setPrimaryKeyName] = useState("");
    const [tableStructure, setTableStructure] = useState([]);

    const [tableBrowserKey, setTableBrowserKey] = useState(0);

    const [isAvailable, setIsAvailable] = useState(false);
    const [occ, setIsOcc] = useState(false);
    // setData("Query Tool");

    const logger = QueryLogger.getInstance();

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

    function getTableTakenStatus(selectedDatabase, selectedTable) {
        return fetch(`http://localhost:8080/api/accesscontroller/addAndCheck/${selectedDatabase}/${selectedTable}/${userName}`)
            .then((response) => response.text())
            .then((data) => {
                console.log(data);
                setIsAvailable(data === "true");
                setIsOcc(true);
                return data === "true";
            })
            .catch((error) => {
                console.error("Error fetching table taken status:", error);
                return false;
            });
    }

    function checkPosition(selectedDatabase, selectedTable) {
        return fetch(`http://localhost:8080/api/accesscontroller/checkPosition/${selectedDatabase}/${selectedTable}/${userName}`)
            .then((response) => response.text())
            .then((data) => {
                console.log(data);
                return data;
            })
            .catch((error) => {
                return -1;
            });
    }

    useEffect(() => {
        console.log("isAvailable: ", isAvailable);
        console.log("isButtonPressed: ", isButtonPressed);
        if (isAvailable === false && isButtonPressed === true) {
            const fetchData = async () => {
                const data = await checkPosition(selectedDatabase, selectedTable);
                return data;
            };

            fetchData();

            const intervalId = setInterval(async () => {
                const res = await fetchData();
                console.log(res);
                if (res === "0") {
                    clearInterval(intervalId);

                    runQuery(selectedDatabase, selectedTable, selectedColumns)
                        .then(result => {
                            setQueryResult(result);
                            setIsButtonPressed(true);
                            setTableBrowserKey(prevKey => prevKey + 1);
                        })
                        .catch(error => {
                            console.error(error);
                        });
                    setIsOcc(true);
                }
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [isButtonPressed, selectedDatabase, selectedTable, userName]);


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
    }, [userName, selectedDatabase]);

    useEffect(() => {
        setAvailableColumns([]);

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
        setSelectedColumns([]);
    }, [selectedTable]);

    useEffect(() => {
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
        if (selectedDatabase && selectedTable) {
            fetchTableStructure(selectedDatabase, selectedTable)
                .then((response) => {
                    setTableStructure(response);
                })
                .catch((error) =>
                    console.error("Error fetching columns for the selected table:", error)
                );
        }
    }, [selectedDatabase, selectedTable]);

    useEffect(() => {
        fetchAvailableDatabases(userName)
            .then(({databases, columnsByDatabase}) => {
                setAvailableDatabases(databases);
                setColumnsByDatabase(columnsByDatabase);
            })
            .catch((error) => console.error("Error fetching databases:", error));
    }, [userName]);

    const transitions = useTransition(selectedDatabase, {
        from: {opacity: 0, transform: 'translateY(-20px)'},
        enter: {opacity: 1, transform: 'translateY(0)'},
        leave: {opacity: 0, transform: 'translateY(-20px)'},
    });

    return (
        <Paper sx={{ width: 'calc(80vw)', height: 'calc(86vh)', overflow: 'auto' }} elevation={3} style={{ padding: '10px', margin: '10px', borderRadius: '8px' }}>
            <Grid2 container direction="column" alignItems="flex-start" spacing={2} style={{marginTop: '12px'}}>
                {!("result" in queryResult) && (
                    <Grid2>
                        <Grid2 container spacing={2} alignItems="center" direction="row">
                            {!("result" in queryResult) && (<Grid2>
                                <FormControl variant="outlined">
                                    <InputLabel id="demo-simple-select-label">Select Database</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedDatabase}
                                        onChange={handleSelectOne}
                                        variant={"outlined"}
                                        style={{width: '125px'}}
                                    >
                                        {availableDatabases.map((option, index) => (
                                            <MenuItem key={index} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid2>)}

                            {transitions(
                                (style, item) =>
                                    item && !("result" in queryResult) && (
                                        <animated.div style={style}>
                                            <Grid2>
                                                <FormControl variant="outlined">
                                                    <InputLabel id="demo-simple-select-table">Select Table</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-table"
                                                        id="demo-simple-table"
                                                        value={selectedTable}
                                                        onChange={handleSelectTwo}
                                                        variant={"outlined"}
                                                        style={{width: '125px'}}
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

                            {selectedTable && !("result" in queryResult) && (
                                <Grid2 item>
                                    <FormControl variant="outlined">
                                        <InputLabel id="demo-multiple-checkbox-label">Select Columns</InputLabel>
                                        {availableColumns.length === 0 ? (
                                            <div style={{padding: '10px', color: 'gray'}}>No columns available to
                                                select</div>
                                        ) : (
                                            <Select
                                                labelId="demo-multiple-checkbox-label"
                                                id="demo-multiple-checkbox"
                                                multiple
                                                value={selectedColumns}
                                                onChange={handleSelectThree}
                                                input={<OutlinedInput label="Select Columns"/>}
                                                renderValue={(selected) => selected.join(', ')}
                                                variant={"outlined"}
                                                style={{width: '175px'}}
                                            >
                                                {availableColumns.map((name) => (
                                                    <MenuItem key={name} value={name}>
                                                        <Checkbox checked={selectedColumns.includes(name)}/>
                                                        <ListItemText primary={name}/>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </FormControl>
                                </Grid2>
                            )}

                            {selectedTable && selectedColumns.length > 0 && tableStructure.length > 0 && !("result" in queryResult) && (
                                <Grid2 item>
                                    <Button
                                        size={"large"}
                                        variant="contained"
                                        style={{marginLeft: 16}}
                                        onClick={async () => {
                                            const res = await getTableTakenStatus(selectedDatabase, selectedTable);
                                            setOccupiedTableInfo({
                                                databaseName: selectedDatabase,
                                                tableName: selectedTable,
                                                userName: getCookie("userName")
                                            });

                                            if (res) {
                                                runQuery(selectedDatabase, selectedTable, selectedColumns)
                                                    .then(result => {
                                                        setQueryResult(result);
                                                        console.log(result);
                                                        console.log(tableStructure);
                                                        setTableBrowserKey(prevKey => prevKey + 1);
                                                        setIsButtonPressed(true);
                                                    })
                                                    .catch(error => {
                                                        console.error(error);
                                                    });
                                            } else {
                                                setIsButtonPressed(true);
                                            }
                                        }}
                                    >
                                        Fetch Data
                                    </Button>
                                </Grid2>
                            )}
                        </Grid2>
                    </Grid2>
                )}
                {isButtonPressed && selectedTable && selectedColumns.length > 0 && tableStructure.length > 0 && "result" in queryResult && occ && (

                        <Grid2 style={{marginTop: '16px'}}>
                            <TableBrowserNew
                                key={tableBrowserKey}
                                data={queryResult.result}
                                fetchTime={-1}
                                tableName={selectedTable}
                                databaseName={selectedDatabase}
                                selectedColumns={selectedColumns}
                                primaryKey={primaryKeyName}
                                tableStructure={tableStructure}
                                setData={setData}
                            />
                        </Grid2>
                )}

            </Grid2>
        </Paper>

    );

};

export default QueryTool;
