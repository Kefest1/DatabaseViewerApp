import { getCookie } from "../../../getCookie";
import React, { useEffect, useState } from "react";
import "./Statictics.css";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {Container, ListItemButton, Typography} from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { FixedSizeList } from 'react-window';



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
            `http://localhost:8080/api/databaseinfo/getStatistics/${databaseName}/${userName}`
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
            <Select
                labelId="demo-simple-select-database"
                id="demo-simple-database"
                value={selectedDatabase}
                onChange={handleDatabaseChange}
                className="database-select"
                style={{width: '200px'}}
                variant={"outlined"}
            >
                <MenuItem value="">Select a database</MenuItem >
                {databases.map((database, index) => (
                    <MenuItem key={index} value={database}>{database}</MenuItem >
                ))}
            </Select>
            {selectedDatabase && (
                <div>
                    <div>
                        <h2>
                            Select from {databaseStatistics.tableCount} tables:
                        </h2>
                    </div>
                    <p>Available Tables:</p>
                    <Select
                        labelId="demo-simple-select-database"
                        id="demo-simple-database"
                        value={selectedTable}
                        onChange={handleTableChange}
                        className="database-select"
                        style={{width: '200px'}}
                        variant={"outlined"}
                    >
                        <MenuItem value="">Select a table</MenuItem>
                        {tables.map((table, index) => (
                            <MenuItem key={index} value={table}>{table}</MenuItem>
                        ))}
                    </Select>
                </div>
            )}
            {selectedTable && (
                <div>
                    {databaseStatistics.tableStatistics
                        .filter((stats) => stats.tableName === selectedTable)
                        .map((stats) => (
                            <div key={stats.tableName}>
                                <h2>Statistics for {stats.tableName}:</h2>
                                <h2>Row Count: {stats.columnCounts}</h2>
                                <h2>Column Count: {stats.rowCount}</h2>

                                <FixedSizeList
                                    height={125}
                                    width={360}
                                    itemSize={30}
                                    itemCount={stats.rowNames.length}
                                    overscanCount={5}
                                >
                                    {({ index, style }) => {
                                        const rowName = stats.rowNames[index];
                                        return (
                                            <ListItem key={index} style={style} component="div" disablePadding>
                                                <ListItemText primary={rowName.columnName} />
                                            </ListItem>
                                        );
                                    }}
                                </FixedSizeList>

                                <Select
                                    value={selectedColumn1}
                                    onChange={handleColumn1Change}
                                    className="column-select"
                                    variant="outlined"
                                    style={{ height: '40px' }}
                                >
                                    <MenuItem value="">
                                        <em>Select column 1</em>
                                    </MenuItem>
                                    {stats.rowNames.map((rowName, index) => (
                                        <MenuItem key={index} value={rowName.columnName}>
                                            {rowName.columnName}
                                        </MenuItem>
                                    ))}
                                </Select>

                                <Select
                                    value={selectedColumn2}
                                    onChange={handleColumn2Change}
                                    className="column-select"
                                    style={{ height: '40px' }}
                                    variant="outlined"
                                >
                                    <MenuItem value="">
                                        <em>Select column 2</em>
                                    </MenuItem>
                                    {stats.rowNames
                                        .filter(rowName => rowName.columnType === "Long" || rowName.columnType === "Numeric" || rowName.columnType === "Integer")
                                        .map((rowName, index) => (
                                            <MenuItem key={index} value={rowName.columnName}>
                                                {rowName.columnName}
                                            </MenuItem>
                                        ))}
                                </Select>

                                {selectedColumn1 && selectedColumn2 && (
                                    <div>
                                        {MyPlot(xPlot, yPlot, selectedColumn1, selectedColumn2, selectedTable, selectedDatabase)}
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

    let finalData = [];
    if (xPlot.length > 0 && yPlot.length > 0) {
        for (let i = 0; i < xPlot.length; i++) {
            finalData.push({name: xPlot[i], value1: yPlot[i]});
        }
    }
    const text = `Plotting ${xPlotName} with ${yPlotName} for ${selectedTable} in ${selectedDatabase}`;

    return (
        <div>
            <Container>
                <Typography variant="h4" gutterBottom>
                    Plotting {xPlotName} with {yPlotName} for {selectedTable} in {selectedDatabase}
                </Typography>
                <LineChart width={1100} height={300} data={finalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey={text} stroke="#8884d8" />
                </LineChart>
                <Typography variant="h4" gutterBottom>
                    
                </Typography>
            </Container>
        </div>
    )
};
