import React, {useEffect, useState} from 'react';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {Button, MenuItem} from "@mui/material";
import {getCookie} from "../../../getCookie";
import Select from "@mui/material/Select";

async function fetchAvailableTables(databaseName, tableName) {
    const userName = getCookie("userName");

    const response = await fetch(`http://localhost:8080/api/tableconnection/getconnectedtables/${databaseName}/${tableName}/${userName}`);
    console.log(`http://localhost:8080/api/tableconnection/getconnectedtables/${databaseName}/${tableName}/${userName}`);

    return await response.json();
}

function mergeTwoTables(tableOne, tableTwo, rowsOne, rowsTwo) {

}

async function fetchNewTable(database, table) {
    const userName = getCookie("userName");

    const requestBody = { database, table };

    console.log(JSON.stringify(requestBody));
    const url = 'http://localhost:8080/api/tableinfo/getAllFieldsAllColumns';

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    return await response.json();
}

function basicProcessData1(data) {
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.columnId]) {
            acc[item.columnId] = {};
        }
        acc[item.columnId][item.columnName] = item.dataValue;
        return acc;
    }, {});

    const columnNames = Object.keys(groupedData[Object.keys(groupedData)[0]]);

    const rows = Object.values(groupedData).map((group) => {
        return columnNames.reduce((acc, columnName) => {
            acc[columnName] = group[columnName];
            return acc;
        }, {});
    });

    console.log(columnNames);
    console.log(rows);
    return { columnNames, rows };
}

function basicProcessData(data) {
    const rows = [];
    const columns = {};

    data.forEach((row) => {
        const rowObj = { id: row[0].columnId };
        row.forEach((column) => {
            rowObj[column.columnName] = column.dataValue;
            if (!columns[column.columnName]) {
                columns[column.columnName] = {
                    field: column.columnName,
                    headerName: column.columnName,
                    width: column.dataValue.length * 5,
                    hide: column.columnName === 'columnId',
                };
            } else {
                const maxLength = Math.max(columns[column.columnName].width, column.dataValue.length * 5);
                columns[column.columnName].width = maxLength;
            }
        });

        rows.push(rowObj);


    });

    console.log(rows);
    console.log(columns);

    const resResult = {'Rows' : rows, 'Cols' : columns};
    console.log(resResult);

    return resResult;
}

function Button1DbContent({ data, fetchTime, tableName, databaseName, selectedColumns }) {
    const JoinPanel = ({ tableName, databaseName }) => {
        const [connectableTables, setConnectableTables] = useState([]);
        const [loading, setLoading] = useState(true);

        const [selectedTable, setSelectedTable] = useState("");

        const [selectedTableContent, setSelectedTableContent] = useState([]);
        const [error, setError] = useState(null);

        const handleJoin = async (event) => {
            try {
                const tables = await fetchNewTable(databaseName, selectedTable);
                setSelectedTableContent(tables);
                const processedData = basicProcessData(tables);
                console.log(processedData);
            } catch (error) {
                setError(error.message);
            }
        };

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const tables = await fetchAvailableTables(databaseName, tableName);
                    setConnectableTables(tables);
                    setLoading(false);
                } catch (error) {
                    setError(error.message);
                }
            };

            fetchData();
        }, [databaseName, tableName]);

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <div>
                <h1>For tableName: {tableName}</h1>
                <Select
                    labelId="demo-simple-select-table"
                    id="demo-simple-table"
                    value={selectedTable}
                    label="Select Table"
                    onChange={(event) => setSelectedTable(event.target.value)}
                    variant={"outlined"}
                >
                    {connectableTables.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
                {
                    selectedTable && (
                        <Button onClick={handleJoin}>
                            Join
                        </Button>
                    )
                }
                {
                    selectedTable && (
                        <div>
                            <h2>Selected Table Content:</h2>
                            <h2>{selectedTable}</h2>
                        </div>
                    )
                }
            </div>
        );
    };

    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        processData(data);
        fetchAvailableTables(databaseName, tableName);
    }, [data]);

    function processData(data) {
        const rows = [];
        const columns = {};

        console.log(data);

        data.forEach((row) => {
            const rowObj = { id: row[0].columnId };
            row.forEach((column) => {
                rowObj[column.columnName] = column.dataValue;
                if (!columns[column.columnName]) {
                    columns[column.columnName] = {
                        field: column.columnName,
                        headerName: column.columnName,
                        width: column.dataValue.length * 5,
                        hide: column.columnName === 'columnId',
                    };
                } else {
                    const maxLength = Math.max(columns[column.columnName].width, column.dataValue.length * 5);
                    columns[column.columnName].width = maxLength;
                }
            });

            columns['actions'] = {
                field: 'actions',
                headerName: 'Actions',
                width: 100,
                renderCell: (params) => (
                    <button onClick={() => commitDeleteSingleRow(params)}>
                        <DeleteIcon />
                    </button>
                ),
            };

            rows.push(rowObj);
        });

        setRows(rows);
        setColumns(Object.values(columns));
    }

    const commitDeleteSingleRow = (params) => {
        fetch('http://localhost:8080/api/fieldinfo/deleteArray', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([params.row.id])
        })
            .then(response => response.json())
            .catch(error => console.error('Error:', error));
    };


    const debugData = () => {
        const newColumns = columns.slice(0, Math.floor(columns.length / 2));
        console.log(columns);
        console.log(rows);
        // setColumns(newColumns);
    };

    return (
        <Box sx={{ height: 400, width: 1100 }}>
            <Button onClick={debugData}>Debug</Button>
            <JoinPanel
                tableName={tableName}
                databaseName={databaseName}>
            </JoinPanel>
            <DataGrid
                rows={rows}
                columns={columns}
                minColumnWidth={100}
                checkboxSelection
                disableRowSelectionOnClick
                slots={{ toolbar: GridToolbar }}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    console.log(newRowSelectionModel);
                }}
            />
        </Box>
    );
}

export default Button1DbContent;