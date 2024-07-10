import React, {useEffect, useState} from "react";
import {getCookie} from "../../../getCookie";
import Button1DbContent from "./Button1DbContent";
import QueryLogger from './QueryLogger';

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

const QueryTool = () => {
    const [databases, setDatabases] = useState([]);
    const [columnsByDatabase, setColumnsByDatabase] = useState({});
    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [selectedTable, setSelectedTable] = useState("");
    const [tablesForSelectedDatabase, setTablesForSelectedDatabase] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [availableColumns, setAvailableColumns] = useState([]);
    const [isQueryRunning, setIsQueryRunning] = useState(false);
    const [queryResult, setQueryResult] = useState([]);

    const logger = new QueryLogger();

    function handleColumnCheckboxChange(column) {
        setSelectedColumns((prevSelectedColumns) => {
            if (prevSelectedColumns.includes(column)) {
                return prevSelectedColumns.filter((col) => col !== column);
            } else {
                return [...prevSelectedColumns, column];
            }
        });
    }

    const userName = getCookie("userName");

    useEffect(() => {
        fetchAvailableDatabases(userName)
            .then(({ databases, columnsByDatabase }) => {
                setDatabases(databases);
                setColumnsByDatabase(columnsByDatabase);
            })
            .catch((error) => console.error("Error fetching databases:", error));
    }, [userName]);

    useEffect(() => {
        if (selectedDatabase) {
            setAvailableColumns(columnsByDatabase[selectedDatabase] || []);
            console.log("Here");
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
        if (selectedDatabase && selectedTable) {
            localStorage.setItem("selectedDatabase", selectedDatabase);
            setSelectedColumns([]);
            fetchColumnsForTable(userName, selectedDatabase, selectedTable)
                .then((columns) => setAvailableColumns(columns))
                .catch((error) =>
                    console.error("Error fetching columns for the selected table:", error)
                );
        }
    }, [userName, selectedDatabase, selectedTable]);

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "left",
                }}
            >
                <h5 style={{margin: "0 10px"}}>
                    Create your own customizable query for{" "}
                </h5>
                <select
                    value={selectedDatabase}
                    onChange={(e) =>
                        {
                            setSelectedDatabase(e.target.value);
                            logger.addLog("PUSHED");
                            console.log("PUSHED");
                        }
                    }
                >
                    <option value="">Select a database</option>
                    {databases.map((database, index) => (
                        <option key={index} value={database}>
                            {database}
                        </option>
                    ))}
                </select>

                {selectedDatabase && (
                    <div>
                        <label>{'\u00A0\u00A0\u00A0'}Select a table:{'\u00A0'}</label>

                        <select
                            value={selectedTable}
                            onChange={(e) => setSelectedTable(e.target.value)}
                        >
                            <option value="">Select a table</option>

                            {tablesForSelectedDatabase.map((table, index) => (
                                <option key={index} value={table}>
                                    {table}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>


            {selectedDatabase && selectedTable && (
                <div style={{marginTop: "10px"}}>
                    <label>Select columns:</label>
                    {availableColumns.map((column, index) => (
                        <div key={index}>
                            <input
                                type="checkbox"
                                value={column}
                                checked={selectedColumns.includes(column)}
                                onChange={() => handleColumnCheckboxChange(column)}
                            />
                            <label>{column}</label>
                        </div>
                    ))}
                </div>
            )}

            <div style={{marginTop: "10px"}}>
                <button
                    onClick={() => {
                        runQuery(selectedDatabase, selectedTable, selectedColumns)
                            .then(result => {
                                setQueryResult(result);
                                setIsQueryRunning(true);
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    }}
                >
                    Run
                </button>
            </div>
            {isQueryRunning && <Button1DbContent data={queryResult.result} fetchTime={queryResult.fetchTime} />}
        </div>
    );
};

export default QueryTool;
