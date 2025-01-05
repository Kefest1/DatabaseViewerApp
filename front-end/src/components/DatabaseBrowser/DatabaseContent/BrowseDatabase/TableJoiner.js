import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
    DataGrid,
    GridRowEditStopReasons,
    GridToolbar,
    GridToolbarContainer,
    useGridApiRef,
} from '@mui/x-data-grid';
import {getCookie} from "../../../getCookie";
import {MenuItem} from "@mui/material";
import Select from "@mui/material/Select";


function prepareColumns(selectedColumns, primaryKey) {
    let columns = []

    selectedColumns.forEach(
        columnName => {
            let col = {
                field: columnName,
                headerName: columnName,
                width: 100,
                editable: false,
                align: 'left',
                headerAlign: 'left'
            }

            columns.push(col);
        }
    )

    return columns;
}

const logUpdatable = async (fieldsToUpdate) => {
    try {
        const response = await fetch('http://localhost:8080/api/fieldinfo/update', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fieldsToUpdate),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};

const fetchJoinInfo = async (databaseName, tableName) => {
    const userName = getCookie("userName");
    const response = await fetch(`http://localhost:8080/api/tableconnection/getconnectedtables/${databaseName}/${tableName}/${userName}`)
    return await response.json();
}

const fetchJoinTable = async (databaseName, tableName) => {
    const userName = getCookie("userName");

    const requestBody = {
        table: tableName
    };

    try {
        const response = await fetch(`http://localhost:8080/api/tableinfo/getAllFieldsAllColumns`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userName}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

function TableJoiner({ data, ColumnNames, fetchTime, tableName, databaseName, selectedColumns, primaryKey }) {
    const apiRef = useGridApiRef();

    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});

    const [fieldsToUpdate, setFieldsToUpdate] = useState([]);
    const [newRows, setNewRows] = useState([]);

    const [joinInfo, setJoinInfo] = useState([]);
    const [joinAbleTables, setJoinAbleTables] = useState([]);
    const [selectedJoinTable, setSelectedJoinTable] = useState("");

    const [columns, setColumns] = useState([]);

    const JoinPanel = () => {
        if (joinAbleTables !== []) {
            return (
                <div>
                    <Select
                        labelId="demo-simple-select-table"
                        id="demo-simple-table"
                        value={selectedJoinTable}
                        label="Select Table To Join"
                        onChange={onSelectJoin}
                        variant={"outlined"}
                    >
                        {joinAbleTables.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button onClick={() => performJoin()}>
                        Perform join on selected table
                    </Button>
                </div>
            )
        }
    }

    function onSelectJoin(e) {
        setSelectedJoinTable(e.target.value);
    }

    function performJoin() {
        let informationJoin = [];
        joinInfo.forEach(info => {
            if (info.oneTableName === selectedJoinTable) {
                informationJoin = info;
            }
        });

        console.log(informationJoin);
        fetchJoinTable(databaseName, informationJoin.oneTableName)
            .then(async fetchedJoinTable => {
                mergeTwoTables(fetchedJoinTable, (fetchedJoinTable[0].map(column => column.columnName))
                    .filter(item => item !== informationJoin.oneColumnName), informationJoin);

                const res = await fetchJoinInfo(databaseName, informationJoin.oneTableName);
                console.log(res);

            })
            .catch(error => {
                console.error('Error fetching join table:', error);
            });

    }

    function mergeTwoTables(rowsToMerge, columnsToMerge, informationJoin) {
        let finalRows = [];

        const deepCopyRows = JSON.parse(JSON.stringify(rows));
        deepCopyRows.forEach(row => {
            const joinId = row[informationJoin.manyColumnName];
            const nodes = findRowToJoin(rowsToMerge, informationJoin.oneColumnName, joinId);
            nodes.forEach(item => {
                const key = Object.keys(item)[0];
                row[key] = item[key];
            });

            finalRows.push(row);
        });

        const newColNames = findColumnsToJoin(rowsToMerge, informationJoin.oneColumnName);

        let newColumns = []
        newColNames.forEach(col => {
            let nod = {};
            nod["field"] = col;
            nod["headerName"] = col;
            nod["width"] = 100;
            nod["editable"] = false;
            nod["headerAlign"] = "left";
            nod["align"] = "left";

            newColumns.push(nod);
        });

        const columnsCopy = JSON.parse(JSON.stringify(columns));
        const mergedArray = [...columnsCopy, ...newColumns];

        const finalColumns = mergedArray.sort((a, b) => {
            if (a.field === "actions") return 1;
            if (b.field === "actions") return -1;
            return 0;
        });

        console.log(finalRows);
        console.log(finalColumns);

        setRows(finalRows);

        apiRef.current.updateColumns(finalColumns);

    }

    function findRowToJoin(rowsToMerge, oneColumnName, joinId) {
        for (const row of rowsToMerge) {
            for (const item of row) {
                if (item.columnName === oneColumnName && item.dataValue === joinId) {
                    return row
                        .filter(item => item.columnName !== oneColumnName)
                        .map(item => ({[item.columnName]: item.dataValue}));
                }
            }
        }
        return null;
    }

    function findColumnsToJoin(rowsToMerge, oneColumnName) {
        const node = rowsToMerge[0];
        let ret = [];
        node.forEach(col => {
            if (col.columnName !== oneColumnName) {
                ret.push(col.columnName);
            }
        })

        return ret;
    }


    useEffect(() => {
        const col = prepareColumns(selectedColumns, primaryKey);
        setColumns(col);
    }, []);

    const processData = (data, setRows) => {
        const rows = [];

        data.forEach((row) => {
            const rowObj = {id: row[0].columnId};
            row.forEach((column) => {
                rowObj[column.columnName] = column.dataValue;
            });
            rows.push(rowObj);
        });

        setRows(rows);
    }

    useEffect(() => {
        processData(data, setRows);
    }, [data, selectedColumns]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchJoinInfo(databaseName, tableName);
            setJoinInfo(response);
            let tables = [];
            response.forEach(r => {
                tables.push(r.oneTableName);
            })
            setJoinAbleTables(tables);
        };

        fetchData();
    }, []);


    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const processRowUpdate = (newRow, originalRow) => {
        if (newRow.id < 0 || originalRow.id < 0) {
            setNewRows(prevRows => [...prevRows, newRow]);
            const updatedRow = {...newRow, isNew: false};
            setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

            return updatedRow;
        } else {
            const updatedRow = {...newRow, isNew: false};
            setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

            let request = findDifference(originalRow, updatedRow);
            request["rowIndex"] = originalRow.id;

            setFieldsToUpdate((prevFields) => [...prevFields, request]);

            return updatedRow;
        }
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    function processError(params) {
        console.log(params);
    }

    function Debug() {
        console.log(rows);
        console.log(columns);
    }

    const CustomToolbar = ({setRows, setRowModesModel}) => {
        return (
            <GridToolbarContainer>
                <GridToolbar/>
            </GridToolbarContainer>
        );
    };

    return (
        <Box sx={{height: 600, width: 1200}}>
            <Box sx={{display: 'flex', gap: 1, mb: 2}}>
                <Button onClick={Debug}>Debug</Button>
            </Box>
            <JoinPanel/>
            <DataGrid
                rows={rows}
                columns={columns}
                apiRef={apiRef}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={processError}
                slots={{
                    toolbar: CustomToolbar,
                }}
                slotProps={{
                    toolbar: {setRows, setRowModesModel},
                }}
            />
        </Box>
    );


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
}

export default TableJoiner;
