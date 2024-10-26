import { getCookie } from "../../../getCookie";
import React, { useEffect, useState } from "react";
import "./Statictics.css";

const Statistics = () => {
    const [databases, setDatabases] = useState([]);
    const [selectedDatabase, setSelectedDatabase] = useState('');
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [databaseStatistics, setDatabaseStatistics] = useState({});

    const [xPlot, setXPlot] = useState([]);
    const [yPlot, setYPlot] = useState([]);

    const [selectedColumn1, setSelectedColumn1] = useState('');
    const [selectedColumn2, setSelectedColumn2] = useState('');

    async function GetDatabases() {
        const userName = getCookie("userName");

        const response = await fetch(
            "http://localhost:8080/api/tableinfo/getAvailableDatabases/" + userName
        );
        const data = await response.json();
        setDatabases(data);
    }

    async function GetXPlot() {
        const response = await fetch(
            "http://localhost:8080/api/fieldinfo/getColumns/" + selectedDatabase + '/' + selectedTable + '/' + selectedColumn1
        );
        const data = await response.json();
        setXPlot(data);
        console.log(data);
    }

    async function GetYPlot() {
        const response = await fetch(
            "http://localhost:8080/api/fieldinfo/getColumns/" + selectedDatabase + '/' + selectedTable + '/' + selectedColumn2
        );
        const data = await response.json();
        setYPlot(data);
        console.log(data);
    }

    useEffect(() => {
        if (selectedColumn1) {
            GetXPlot();
        }
    }, [selectedColumn1]);

    useEffect(() => {
        if (selectedColumn2) {
            GetYPlot();
        }
    }, [selectedColumn2]);

    useEffect(() => {
        GetDatabases().then(() => {

        }).catch((error) => {
            console.error(error);
        });
    }, []);

    const handleDatabaseChange = (event) => {
        setSelectedDatabase(event.target.value);
        getTables(event.target.value);
        getDatabaseStatistics(event.target.value);
    };

    async function getTables(databaseName) {
        const userName = getCookie("userName");
        const response = await fetch(
            `http://localhost:8080/api/tableinfo/getTables/${userName}/${databaseName}`
        );
        const data = await response.json();
        setTables(data);
    }

    async function getDatabaseStatistics(databaseName) {
        const userName = getCookie("userName");
        const response = await fetch(
            `http://localhost:8080/api/databaseinfo/getStatistics/${databaseName}`
        );
        const data = await response.json();
        console.log(data);
        setDatabaseStatistics(data);
    }

    const handleTableChange = (event) => {
        setSelectedTable(event.target.value);
    };


    const handleColumn1Change = (event) => {
        setSelectedColumn1(event.target.value);
    };

    const handleColumn2Change = (event) => {
        setSelectedColumn2(event.target.value);
    };

    return (
        <div>
            <h2>Available Databases:</h2>
            <select value={selectedDatabase} onChange={handleDatabaseChange} className="database-select">
                <option value="">Select a database</option>
                {databases.map((database, index) => (
                    <option key={index} value={database}>{database}</option>
                ))}
            </select>
            <p>Selected Database: {selectedDatabase}</p>
            {databaseStatistics && (
                <div>
                    <h2>
                        Select from {databaseStatistics.tableCount} tables:
                    </h2>
                </div>
            )}
            <p>Available Tables:</p>
            <select value={selectedTable} onChange={handleTableChange} className="table-select">
                <option value="">Select a table</option>
                {tables.map((table, index) => (
                    <option key={index} value={table}>{table}</option>
                ))}
            </select>
            <p>Selected Table: {selectedTable}</p>
            {selectedTable && (
                <div>
                    {databaseStatistics.tableStatistics
                        .filter((stats) => stats.tableName === selectedTable)
                        .map((stats) => (
                            <div key={stats.tableName}>
                                <h2>Statistics for {stats.tableName}:</h2>
                                <h2>Row Count: {stats.rowCount}</h2>
                                <h2>Column Count: {stats.columnCounts}</h2>

                                <ul>
                                    {stats.rowNames.map((rowName, index) => (
                                        <li key={index}>{rowName}</li>
                                    ))}
                                </ul>

                                <h3>Select columns to plot:</h3>
                                <select value={selectedColumn1} onChange={handleColumn1Change} className="column-select">
                                    <option value="">Select column 1</option>
                                    {stats.rowNames.map((rowName, index) => (
                                        <option key={index} value={rowName}>{rowName}</option>
                                    ))}
                                </select>

                                <select value={selectedColumn2} onChange={handleColumn2Change} className="column-select">
                                    <option value="">Select column 2</option>
                                    {stats.rowNames.map((rowName, index) => (
                                        <option key={index} value={rowName}>{rowName}</option>
                                    ))}
                                </select>

                                {selectedColumn1 && selectedColumn2 && (
                                    <div>
                                        {MyPlot(xPlot, yPlot, selectedColumn1, selectedColumn2, selectedTable, selectedDatabase) }
                                    </div>
                                )}

                            </div>
                        ))}
                </div>
            )}

        </div>
    );
};

export default Statistics;

const MyPlot = (xPlot, yPlot, xPlotName, yPlotName, selectedTable, selectedDatabase) => {
    if (xPlot.length > 0 && yPlot.length > 0) {
        console.log(xPlot);
        console.log(yPlot);
    }

    return (
        <div>
            <h2>{selectedDatabase}</h2>
            <h2>{selectedTable}</h2>
        </div>
    )
};
