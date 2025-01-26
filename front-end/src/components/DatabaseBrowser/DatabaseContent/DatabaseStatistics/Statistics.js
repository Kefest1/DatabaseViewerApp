import { getCookie } from "../../../getCookie";
import React, { useEffect, useState } from "react";
import "./Statictics.css";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {Container, FormControl, InputLabel, Paper} from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import { Typography, Box, Grid2} from '@mui/material';
import Button from "@mui/material/Button";
import { BarChart } from '@mui/x-charts/BarChart';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {motion} from "framer-motion";

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

    const [generateGraphClicked, setGenerateGraphClicked] = useState(false);
    const [generateHistogramClicked, setGenerateHistogramClicked] = useState(false);

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

    function flipGraph() {
        setGenerateGraphClicked(true);
        setGenerateHistogramClicked(false);
    }

    return (
        <Paper sx={{ width: 'calc(80vw)', height: 'calc(86vh)', overflow: 'auto' }} elevation={3} style={{ padding: '10px', margin: '10px', borderRadius: '8px' }}>

            <Box sx={{ padding: 2 }}>
                <Box sx={{ padding: 2 }}>
                    <Grid2 container spacing={2} alignItems="center">
                        <Grid2 item>
                            <Typography variant="h4" gutterBottom>
                                Available Databases:
                            </Typography>
                        </Grid2>
                        <Grid2 item>
                            <FormControl variant="outlined">
                                <InputLabel id="database-select-label">Select a Database</InputLabel>
                                <Select
                                    labelId="database-select-label"
                                    id="database-select"
                                    value={selectedDatabase}
                                    onChange={handleDatabaseChange}
                                    variant="outlined"
                                    style={{width: '175px'}}
                                >
                                    {databases.map((database, index) => (
                                        <MenuItem key={index} value={database}>
                                            {database}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid2>
                    </Grid2>

                    {selectedDatabase && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                        <Grid2 container spacing={2} alignItems="center" sx={{ marginTop: 1 }}>
                            <Grid2 item>
                                <Typography variant="h5">
                                    Select from {databaseStatistics.tableCount} tables:
                                </Typography>
                            </Grid2>
                            <Grid2 item>
                                <Select
                                    labelId="table-select-label"
                                    id="table-select"
                                    value={selectedTable}
                                    onChange={handleTableChange}
                                    className="database-select"
                                    sx={{ width: '200px' }}
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
                            </Grid2>
                        </Grid2>
                        </motion.div>

                    )}
                </Box>

                {selectedTable && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Box>
                            {databaseStatistics.tableStatistics
                                .filter((stats) => stats.tableName === selectedTable)
                                .map((stats) => (
                                    <Box key={stats.tableName}>
                                        <TableStatistics stats={stats} />
                                    </Box>
                                ))}
                        </Box>
                    </motion.div>

                )}

                {selectedTable && databaseStatistics.tableStatistics.columnCounts > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                            <Button onClick={flipGraph}>
                                Generate Graph
                            </Button>
                        </Box>
                    </motion.div>

                )}

                {selectedTable && generateGraphClicked && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                    <Box>
                        {databaseStatistics.tableStatistics
                            .filter((stats) => stats.tableName === selectedTable)
                            .map((stats) => (
                                <Box key={stats.tableName} sx={{ marginBottom: 1 }}>
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
                                        <Box sx={{ marginTop: 1 }}>
                                            {MyPlot(xPlot, yPlot, selectedColumn1, selectedColumn2, selectedTable, selectedDatabase)}
                                        </Box>
                                    )}
                                </Box>
                            ))}
                    </Box>
                    </motion.div>
                )}

                {selectedTable && generateHistogramClicked && (

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Box>
                            <h1>Histogram</h1>
                            {databaseStatistics.tableStatistics
                                .filter((stats) => stats.tableName === selectedTable)
                                .map((stats) => (
                                    <Box key={stats.tableName} sx={{ marginBottom: 1 }}>
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

                                            {selectedColumn1 && (
                                                <Box sx={{ marginTop: 1 }}>
                                                    {MyHistogram(xPlot, selectedColumn1, selectedTable, selectedDatabase)}
                                                </Box>
                                            )}
                                    </Box>
                                ))}
                        </Box>

                    </motion.div>
                )}
            </Box>
        </Paper>
    );
};


function PrepareTree(stats) {
    let tree = [{
        id: 'tree',
        label: 'Browse column statistics for ' + stats.stats.tableName,
        children: []
    }];

    stats.stats.rowNames.forEach((rowName, index) => {
        const treeNode = {
            id: rowName.columnName,
            label: rowName.columnName,
        }
        tree[0].children.push(treeNode);
    });

    if (tree[0]["children"].length === 0) {
        return (
            <Box>
                <Typography variant="h6">No columns to display statistics for.</Typography>
            </Box>
        );
    }
    return (
        <RichTreeView items={tree} />
    );
}

const TableStatistics = ({ stats }) => {
    return (
        <Box key={stats.tableName} sx={{ marginBottom: 1 }}>
            <Typography variant="h5">Statistics for {stats.tableName}:</Typography>
            <Typography variant="body1">Row Count: {stats.columnCounts}</Typography>
            <Typography variant="body1">Column Count: {stats.rowCount}</Typography>
            <PrepareTree stats={stats} />
        </Box>
    );
};

export default Statistics;

const MyHistogram = (xPlot, xPlotName, selectedTable, selectedDatabase) => {
    console.log(xPlot);

    const categories = xPlot.map(item => item.category);
    const dataSeries = xPlot.map(item => item.value);

    return (
        <div>
            <h1>{xPlotName}</h1>
            <BarChart
                xAxis={[{ scaleType: 'band', data: categories }]}
                series={[{ data: dataSeries }]}
                width={500}
                height={300}
            />
        </div>
    );
}
const MyPlot = (xPlot, yPlot, xPlotName, yPlotName, selectedTable, selectedDatabase) => {

    let finalData = [];
    if (xPlot.length > 0 && yPlot.length > 0) {
        for (let i = 0; i < xPlot.length; i++) {
            finalData.push({name: xPlot[i], value1: yPlot[i]});
        }
    }
    finalData.sort((a, b) => a.value1 - b.value1);
    console.log(finalData);
    const text = `Plotting ${xPlotName} with ${yPlotName} for ${selectedTable} in ${selectedDatabase}`;

    return (
        <div>
            <Container>
                <LineChart width={1100} height={300} data={finalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value1" stroke="#8884d8" name={text}/>
                </LineChart>
            </Container>
        </div>
    )
};
