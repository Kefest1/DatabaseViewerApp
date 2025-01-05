import { getCookie } from "../../../getCookie";
import React, { useEffect, useState } from "react";
import "./Statictics.css";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {Container} from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import { Typography, Box } from '@mui/material';


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
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Available Databases:
            </Typography>
            <Select
                labelId="database-select-label"
                id="database-select"
                value={selectedDatabase}
                onChange={handleDatabaseChange}
                className="database-select"
                sx={{ width: '200px', marginBottom: 1 }}
                variant="outlined"
            >
                <MenuItem value="">
                    <em>Select a database</em>
                </MenuItem>
                {databases.map((database, index) => (
                    <MenuItem key={index} value={database}>
                        {database}
                    </MenuItem>
                ))}
            </Select>

            {selectedDatabase && (
                <Box sx={{ marginBottom: 1 }}>
                    <Typography variant="h5">
                        Select from {databaseStatistics.tableCount} tables:
                    </Typography>
                    <Typography variant="body1">Available Tables:</Typography>
                    <Select
                        labelId="table-select-label"
                        id="table-select"
                        value={selectedTable}
                        onChange={handleTableChange}
                        className="database-select"
                        sx={{ width: '200px', marginBottom: 1 }}
                        variant="outlined"
                    >
                        <MenuItem value="">
                            <em>Select a table</em>
                        </MenuItem>
                        {tables.map((table, index) => (
                            <MenuItem key={index} value={table}>
                                {table}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            )}

            {selectedTable && (
                <Box>
                    {databaseStatistics.tableStatistics
                        .filter((stats) => stats.tableName === selectedTable)
                        .map((stats) => (
                            <Box key={stats.tableName} sx={{ marginBottom: 3 }}>
                                <Typography variant="h5">Statistics for {stats.tableName}:</Typography>
                                <Typography variant="body1">Row Count: {stats.rowCount}</Typography>
                                <Typography variant="body1">Column Count: {stats.columnCounts}</Typography>

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

                                <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                                    <Select
                                        value={selectedColumn1}
                                        onChange={handleColumn1Change}
                                        className="column-select"
                                        variant="outlined"
                                        sx={{ height: '40px', flex: 1 }}
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
                                        variant="outlined"
                                        sx={{ height: '40px', flex: 1 }}
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
                                </Box>

                                {selectedColumn1 && selectedColumn2 && (
                                    <Box sx={{ marginTop: 2 }}>
                                        {MyPlot(xPlot, yPlot, selectedColumn1, selectedColumn2, selectedTable, selectedDatabase)}
                                    </Box>
                                )}
                            </Box>
                        ))}
                </Box>
            )}
        </Box>
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
    console.log(finalData);
    const text = `Plotting ${xPlotName} with ${yPlotName} for ${selectedTable} in ${selectedDatabase}`;

    return (
        <div>
            <Container>
                {/*<Typography variant="h4" gutterBottom>*/}
                {/*    Plotting {xPlotName} with {yPlotName} for {selectedTable} in {selectedDatabase}*/}
                {/*</Typography>*/}
                <LineChart width={1100} height={300} data={finalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value1" stroke="#8884d8" name={text}/>
                </LineChart>
                <Typography variant="h4" gutterBottom>
                    
                </Typography>
            </Container>
        </div>
    )
};
