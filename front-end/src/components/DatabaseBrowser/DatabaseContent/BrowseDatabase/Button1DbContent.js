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

    return await response.json();
}

async function fetchNewTable(database, table) {
    const userName = getCookie("userName");

    const requestBody = { database, table };

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

    const resResult = {'Rows' : rows, 'Cols' : Object.values(columns)};
    console.log(resResult);

    return resResult;
}

const removeDuplicates = (arr) => {
    const seenFields = new Set();
    return arr.filter(item => {
        if (seenFields.has(item.field)) {
            return false;
        } else {
            seenFields.add(item.field);
            return true;
        }
    });
};

function prepareColumns(joinColumns, columns) {
    return removeDuplicates(columns.concat(joinColumns));
}

function mergeRows(joinRows, joinColumns, selectedTable, rows, columns, availableTables) {

    return rows.map(item2 => {
        const matchingItem = joinRows.find(item1 => item1[availableTables[0].manyColumnName] === item2[availableTables[0].oneColumnName]);
        if (matchingItem) {
            const { [availableTables[0].oneColumnName]: _, ...item2WithoutKey } = item2;
            return {
                ...matchingItem,
                ...item2WithoutKey
            };
        }
        return null; // Return null if no match is found
    }).filter(item => item !== null); // Filter out null values
}

function Button1DbContent({ data, fetchTime, tableName, databaseName, selectedColumns }) {
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectedRowsIndex, setSelectedRowsIndex] = useState([]);
    const [fieldsToUpdate, setFieldsToUpdate] = useState([]);

    const JoinPanel = ({ tableName, databaseName }) => {
        const [connectableTables, setConnectableTables] = useState([]);
        const [loading, setLoading] = useState(true);

        const [selectedTable, setSelectedTable] = useState("");

        const [selectedTableContent, setSelectedTableContent] = useState([]);
        const [error, setError] = useState(null);

        const [availableTables, setAvailableTables] = useState(null);


        const handleJoin = async (event) => {
            try {
                const tables = await fetchNewTable(databaseName, selectedTable);

                const joinTables = basicProcessData(tables);
                const joinRows = joinTables.Rows;
                const joinColumns = joinTables.Cols;
                setSelectedTableContent(tables);

                let processedRows = mergeRows(joinRows, joinColumns, selectedTable, rows, columns, availableTables);
                let processedColumns = prepareColumns(columns, joinColumns);

                setColumns(processedColumns)
                setRows(processedRows)
            } catch (error) {
                setError(error.message);
            }
        };

        useEffect(() => {
            const fetchData = async () => {
                try {

                    const tables = await fetchAvailableTables(databaseName, tableName);

                    setAvailableTables(tables);

                    setConnectableTables(
                        tables.map(item => {
                            return item.oneTableName;
                        }
                    ));
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

    useEffect(() => {
        processData(data);
    }, [data]);

    function processData(data) {
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
                        editable: true
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


    const commitDeleteManyRows = () => {
        console.log(selectedRowsIndex);

        fetch('http://localhost:8080/api/fieldinfo/deleteArray', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedRowsIndex)
        })
            .then(response => response.json())
            .catch(error => console.error('Error:', error));
    };


    const debugData = () => {
        console.log(columns);
        console.log(rows);
        console.log(selectedRowsIndex);
    };

    const handleRowEditStop = (newRow) => {
        console.log(newRow);
    };

    const handleEdit = (updatedRow, originalRow) => {
        console.log(originalRow);
        console.log(updatedRow);
        let request = findDifference(originalRow, updatedRow);
        request["rowIndex"] = originalRow.id;
        addFieldToUpdate(request);
    };

    function findDifference(obj1, obj2) {
        let differences = {};

        for (const key in obj1) {
            if (obj1.hasOwnProperty(key)) {
                if (obj2.hasOwnProperty(key) && obj1[key] !== obj2[key]) {
                    differences = {
                        columnName: key,
                        newDataValue: obj2[key]
                    };
                    break;
                }
            }
        }

        return differences;
    }

    const addFieldToUpdate = (newField) => {
        setFieldsToUpdate((prevFields) => [...prevFields, newField]);
    };

    const logUpdatable = async () => {
        console.log(fieldsToUpdate);
        try {
            const response = await fetch('http://localhost:8080/api/fieldinfo/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fieldsToUpdate),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Box sx={{ height: 400, width: 1100 }}>
            <Button onClick={debugData}>Debug</Button>
            <JoinPanel
                tableName={tableName}
                databaseName={databaseName}>
            </JoinPanel>
            <Button onClick={commitDeleteManyRows} rows>
                Delete selected rows
            </Button>
            <Button onClick={logUpdatable} rows>
                Update altered fields
            </Button>
            <DataGrid
                rows={rows}
                columns={columns}
                minColumnWidth={100}
                checkboxSelection
                disableRowSelectionOnClick
                slots={{ toolbar: GridToolbar }}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    console.log(newRowSelectionModel);
                    setSelectedRowsIndex(newRowSelectionModel);
                }}

                editMode="row"
                onRowModesModelChange={(e) => {}}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={handleEdit}
            />
        </Box>
    );
}

export default Button1DbContent;