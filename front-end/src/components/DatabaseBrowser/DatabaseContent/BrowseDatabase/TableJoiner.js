import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
    DataGrid,
    GridToolbar,
    GridToolbarContainer,
    useGridApiRef,
} from '@mui/x-data-grid';
import {getCookie} from "../../../getCookie";
import {MenuItem, Paper} from "@mui/material";
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

const fetchJoinInfo = async (databaseName, tableName) => {
    const userName = getCookie("userName");

    const token = localStorage.getItem("jwtToken");
    const response = await fetch(`http://localhost:8080/api/tableconnection/getconnectedtables/${databaseName}/${tableName}/${userName}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
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

    const [joinInfo, setJoinInfo] = useState([]);
    const [joinAbleTables, setJoinAbleTables] = useState([]);
    const [selectedJoinTable, setSelectedJoinTable] = useState("");

    const [columns, setColumns] = useState([]);

    const JoinPanel = () => {
        if (joinAbleTables.length > 0) {
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
        else {
            return (
                <h5 style={{
                    fontSize: '1.5rem',
                    color: '#333',
                    marginBottom: '15px',
                    fontFamily: 'Arial, sans-serif',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                    letterSpacing: '0.5px',
                    padding: '10px 0',
                    borderBottom: '2px solid #2A70C6FF',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '4px',
                    textAlign: 'center',
                }}>
                    No tables to join!
                </h5>
            )
        }
    }

    function onSelectJoin(e) {
        setSelectedJoinTable(e.target.value);
    }

    async function performJoin() {
        let informationJoin = [];
        joinInfo.forEach(info => {
            if (info.oneTableName === selectedJoinTable) {
                informationJoin = info;
            }
        });

        fetchJoinTable(databaseName, informationJoin.oneTableName)
            .then(async fetchedJoinTable => {
                mergeTwoTables(fetchedJoinTable, (fetchedJoinTable[0].map(column => column.columnName))
                    .filter(item => item !== informationJoin.oneColumnName), informationJoin);

                const res = await fetchJoinInfo(databaseName, informationJoin.oneTableName);
                if (res.length === 0) {
                    return;
                }
                res.forEach(tableData => {
                    setJoinAbleTables(prevJoinAbleTables => [
                        ...prevJoinAbleTables,
                        tableData.oneTableName
                    ]);
                });
            });

        const response = await fetchJoinInfo(databaseName, selectedJoinTable);
        const mergedJoinInfo = joinInfo.concat(response);
        setJoinInfo(mergedJoinInfo);
    }

    function mergeTwoTables(rowsToMerge, columnsToMerge, informationJoin) {
        let finalRows = [];

        const deepCopyRows = JSON.parse(JSON.stringify(rows));
        deepCopyRows.forEach(row => {
            const joinId = row[informationJoin.manyColumnName];
            const nodes = findRowToJoin(rowsToMerge, informationJoin.oneColumnName, joinId);

            const tempNode = [];
            if (nodes === null) {
                columnsToMerge.forEach(col => {
                    tempNode.push({[col]: "null"});
                });
                tempNode.forEach(item => {
                    const key = Object.keys(item)[0];
                    row[key] = item[key];
                });
            }
            else {
                nodes.forEach(item => {
                    const key = Object.keys(item)[0];
                    row[key] = item[key];
                });
            }
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


    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    function processError(params) {
        console.log(params);
    }

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbar/>
            </GridToolbarContainer>
        );
    };

    return (
            <Box sx={{height: 600, width: 1400}}>
                <JoinPanel/>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    apiRef={apiRef}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
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

}

export default TableJoiner;
