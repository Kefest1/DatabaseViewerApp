import React, {useEffect, useState} from 'react';
import {DataGrid, GridActionsCellItem, GridRowEditStopReasons, GridRowModes, GridToolbar} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {Button, MenuItem} from "@mui/material";
import {getCookie} from "../../../getCookie";
import Select from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

let idBuffer = -1;

function handleDeleteClick(id) {
    return undefined;
}

function TableBrowser({ data, ColumnNames, fetchTime, tableName, databaseName, selectedColumns }) {
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectedRowsIndex, setSelectedRowsIndex] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});

    const [fieldsToUpdate, setFieldsToUpdate] = useState([]);


    useEffect(() => {
        processData(data, setRows, setColumns, selectedColumns);
    }, []);

    const addFieldToUpdate = (newField) => {
        setFieldsToUpdate((prevFields) => [...prevFields, newField]);
    };

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleEdit = (updatedRow, originalRow) => {
        let request = findDifference(originalRow, updatedRow);
        request["rowIndex"] = originalRow.id;
        addFieldToUpdate(request);
    };

    const debugData = () => {
        console.log(columns);
        console.log(rows);
        console.log(selectedRowsIndex);
    };

    function handleAdd() {
        const id = idBuffer;
        console.log(selectedColumns)
        idBuffer--;
        const newRow = {
            id
        }
        selectedColumns.forEach(column => {
            newRow[column] = '';
        });
        newRow["isNew"] = true;

        setRows((oldRows) => [
            newRow,
            ...oldRows,
        ]);
    }

    return (
        <Box sx={{ height: 400, width: 1100 }}>
            <Button onClick={debugData}>Debug</Button>
            <Button onClick={() => commitDeleteManyRows(selectedRowsIndex)}>
                Delete selected rows
            </Button>
            <Button onClick={() => commitUpdate(fieldsToUpdate)} rows>
                Update altered fields
            </Button>
            <Button onClick={handleAdd} rows>
                Insert Row
            </Button>

            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setSelectedRowsIndex(newRowSelectionModel);
                }}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: handleAdd,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </Box>
    );

    function processData(data, setRows, setColumns, selectedColumns) {
        const rows = [];
        const columns = {};

        data.forEach((row) => {
            const rowObj = { id: row[0].columnId };
            row.forEach((column) => {
                rowObj[column.columnName] = column.dataValue;
            });
            rows.push(rowObj);
        });

        selectedColumns.forEach((column) => {
            columns[column] = {
                field: column,
                headerName: column,
                width: column.length * 10,
                hide: false,
                editable: true
            }
        });

        columns['actions'] = {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 50,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        };

        setRows(rows);
        setColumns(Object.values(columns));
    }
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

const commitDeleteManyRows = (selectedRowsIndex) => {
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

const commitUpdate = async (fieldsToUpdate) => {
    try {
        console.log("fieldsToUpdate");
        console.log(fieldsToUpdate);
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
    } catch (error) {
        console.error('Error:', error);
    }
};

export default TableBrowser;
