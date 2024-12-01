import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons, GridToolbar,
} from '@mui/x-data-grid';
import {
    randomId,
} from '@mui/x-data-grid-generator';
import {useEffect, useState} from "react";

function prepareColumns(selectedColumns) {
    let columns = []

    selectedColumns.forEach(
        columnName => {
            let col = {
                field: columnName,
                headerName: columnName,
                width: 100,
                editable: true,
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

let newid = -1;

function TableBrowserNew({ data, ColumnNames, fetchTime, tableName, databaseName, selectedColumns }) {
    const [rows, setRows] = useState([]);
    const [unused, setColumns] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [selectedRowsIndex, setSelectedRowsIndex] = useState([]);

    const [fieldsToUpdate, setFieldsToUpdate] = useState([]);
    const [newRows, setNewRows] = useState([]);

    let columns = prepareColumns(selectedColumns);
    columns.push(
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
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
        },
    );

    useEffect(() => {
        processData(data, setRows, setColumns, selectedColumns);
    }, []);

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            console.log("stop");
            event.defaultMuiPrevented = true;
        }
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        console.log(id);
        setRows(rows.filter((row) => row.id !== id));
        commitDeleteSingleRow(id);
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

    const processRowUpdate = (newRow, originalRow) => {
        if (typeof newRow.id === 'string' || typeof originalRow.id === 'string') {
            setNewRows(prevRows => [...prevRows, newRow]);
            const updatedRow = { ...newRow, isNew: false };
            setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

            return updatedRow;
        }
        else {
            console.log(newRow, originalRow);

            const updatedRow = { ...newRow, isNew: false };
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

    const commitDeleteSingleRow = (params) => {
        fetch('http://localhost:8080/api/fieldinfo/deleteArray', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([params])
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

    const commitInsertNewRows = () => {
        console.log(newRows);
        let dtoArray = [];
        newRows.forEach(item => {
            for (const key in item) {
                if (key !== 'id' && key !== 'isNew') {
                    dtoArray.push(
                        {
                            tableName: tableName,
                            dataValue: item[key],
                            columnName: key,
                        }
                    );
                }
            }
        });

        console.log(dtoArray);
        fetch(`http://localhost:8080/api/fieldinfo/insertvalues/${databaseName}`,  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dtoArray)
        })
            .then(response => response.json())
            .catch(error => console.error('Error:', error));
    }

    function processError(params) {
        console.log(params);
    }

    function Debug() {
        console.log(rows);
        console.log(columns);
    }

    const CustomToolbar = ({ setRows, setRowModesModel }) => {
        return (
            <GridToolbarContainer>
                <EditToolbar props={{setRows, setRowModesModel}} />
                <GridToolbar />
            </GridToolbarContainer>
        );
    };

    return (
        <Box
            sx={{ height: 400, width: 1000 }}
        >
            <Button onClick={() => logUpdatable(fieldsToUpdate)} rows>
                Update altered fields
            </Button>
            <Button onClick={commitDeleteManyRows} rows>
                Delete selected rows
            </Button>
            <Button onClick={commitInsertNewRows} rows>
                Commit Insertion
            </Button>
            <Button onClick={Debug} rows>
                Debug
            </Button>

            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                checkboxSelection
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setSelectedRowsIndex(newRowSelectionModel);
                }}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={processError}
                slots={{
                    toolbar: CustomToolbar
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
            width: 100,
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
        console.log(rows)
    }

    function EditToolbar() {

        // const { setRows, setRowModesModel } = props;

        const handleClick = () => {
            const id = "randomId" + newid;
            console.log(id);
            newid--;

            const newRow = {id};

            selectedColumns.forEach(
                (column) => {
                    newRow[column] = ''
                }
            )
            newRow["isNew"] = true;

            setRows((oldRows) => [
                newRow,
                ...oldRows,
            ]);
            setRowModesModel((oldModel) => ({
                ...oldModel,
                [id]: { mode: GridRowModes.Edit, fieldToFocus: selectedColumns[0] },
            }));
        };

        return (
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                    Add record
                </Button>
            </GridToolbarContainer>
        );
    }

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

export default TableBrowserNew;
