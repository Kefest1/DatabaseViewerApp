import React, { useState, useEffect } from "react";
import { getCookie } from "../../getCookie";


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
    const data = await response.json();
    return data;
}

async function runQuery(database, table, column) {
    console.log(database, table, column);
    // Perform your query logic here
    return undefined;
}

const QueryTool = () => {
    const [databases, setDatabases] = useState([]);
    const [columnsByDatabase, setColumnsByDatabase] = useState({});
    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [selectedTable, setSelectedTable] = useState("");
    const [tablesForSelectedDatabase, setTablesForSelectedDatabase] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [availableColumns, setAvailableColumns] = useState([]);

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
                <h5 style={{ margin: "0 10px" }}>
                    Create your own customizable query for{" "}
                </h5>
                <select
                    value={selectedDatabase}
                    onChange={(e) => setSelectedDatabase(e.target.value)}
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
                <div style={{ marginTop: "10px" }}>
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

            <div style={{ marginTop: "10px" }}>
                <button
                    onClick={() => runQuery(selectedDatabase, selectedTable, selectedColumns)}
                >
                    Run
                </button>
            </div>
        </div>
    );
};

export default QueryTool;
