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
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
    randomCreatedDate,
    randomTraderName,
    randomId,
    randomArrayItem,
} from '@mui/x-data-grid-generator';
import {getCookie} from "../../../getCookie";
import {useEffect, useState} from "react";


async function fetchStructure(databaseName, selectedTable) {
    const userName = getCookie("userName");
    const response = await fetch(
        `http://localhost:8080/api/tableinfo/getTableStructure/${userName}/${databaseName}/${selectedTable}`
    );
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

let idBuf = -1;

function DataGridTable({ databaseName, selectedTable }) {

    const [rows, setRows] = useState([])
    const [rowModesModel, setRowModesModel] = useState({});
    const [tablesToDelete, setTablesToDelete] = useState([]);

    function EditToolbar(props) {
        const { setRows, setRowModesModel } = props;

        const handleClick = () => {
            console.log(rows);
            const id = idBuf;
            idBuf--;

            setRows((oldRows) => [
                ...oldRows,
                { id, columnName: '', columnType: '', isNew: true },
            ]);
            setRowModesModel((oldModel) => ({
                ...oldModel,
                [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
            }));
        };

        return (
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                    Add record
                </Button>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleCommit}>
                    Debug?
                </Button>
            </GridToolbarContainer>
        );
    }


    useEffect(() => {
        const loadTableStructure = async () => {
            try {
                const structure = await fetchStructure(databaseName, selectedTable);
                console.log(structure);
                const rowsWithUniqueIds = structure.map(item => ({
                    ...item,
                    id: item.id || idBuf,
                }));
                idBuf--;
                setRows(rowsWithUniqueIds);
            } catch (error) {
                console.error("Error loading table structure:", error);
            }
        };

        if (databaseName && selectedTable) {
            loadTableStructure();
        }
    }, [databaseName, selectedTable]);

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    function commitDelete(tablesToDelete) {
        const url = `http://localhost:8080/api/tableinfo/deleteFieldInfo`
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tablesToDelete),
        })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('Failed to delete. Status: ' + response.status);
                }
            })
            .then(result => {
                console.log('Success:', result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function handleCommit() {

        commitDelete(tablesToDelete);

        const userName = getCookie("userName");
        fetch(`http://localhost:8080/api/tableinfo/addFieldInformation/${databaseName}/${selectedTable}/${userName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rows),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

    }

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        setTablesToDelete((prevTables) => [...prevTables, id]);
        console.log(tablesToDelete);

        setRows(rows.filter((row) => row.id !== id));
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

    const columns = [
        { field: 'columnName', headerName: 'columnName', width: 180, editable: true },
        {
            field: 'columnType',
            headerName: 'columnType',
            // type: 'number',
            width: 80,
            align: 'left',
            headerAlign: 'left',
            editable: true,
        },
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
    ];

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    return (
        <div>
            <Box
                sx={{
                    height: 500,
                    width: '100%',
                    '& .actions': {
                        color: 'text.secondary',
                    },
                    '& .textPrimary': {
                        color: 'text.primary',
                    },
                }}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{ toolbar: EditToolbar }}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel },
                    }}
                />
            </Box>
        </div>
    );
}

export default DataGridTable;
