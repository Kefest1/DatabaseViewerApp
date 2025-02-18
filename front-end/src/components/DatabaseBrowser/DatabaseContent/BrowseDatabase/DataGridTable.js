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
import {getCookie} from "../../../getCookie";
import {useEffect, useState} from "react";
import {FormControl, InputLabel, MenuItem} from "@mui/material";
import Select from "@mui/material/Select";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import './DataGridTable.css';


let idBuf = -1;

function DataGridTable({ databaseName, selectedTable }) {

    async function fetchStructure(databaseName, selectedTable) {
        const userName = getCookie("userName");
        console.log(`http://localhost:8080/api/tableinfo/getTableStructure/${userName}/${databaseName}/${selectedTable}`);
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(
            `http://localhost:8080/api/tableinfo/getTableStructure/${userName}/${databaseName}/${selectedTable}`,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        if (!response.ok) {
            setSnackbarMessage("Could not fetch table structure");
            setSnackbarOpen(true);
            return [];
        }
        return await response.json();
    }

    async function checkIfTableIsEmpty(selectedTable, selectedDatabase) {
        const userName = getCookie("userName");
        const token = localStorage.getItem("jwtToken");
        const url = "http://localhost:8080/api/tableinfo/checkIfTableEmpty/" + selectedDatabase + "/" + selectedTable;
        console.log(url);
        const tables = await fetch(url,{
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!tables.ok) {
            setSnackbarMessage("Could not fetch information");
            setSnackbarOpen(true);
            return [];
        }
        return await tables.json();
    }

    async function fetchPrimaryKeyName(databaseName, tableName) {
        const userName = getCookie("userName");
        const token = localStorage.getItem("jwtToken");
        const url = `http://localhost:8080/api/tableinfo/getKey/${databaseName}/${tableName}/${getCookie("userName")}`
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            setSnackbarMessage("Could not fetch primary key name");
            setSnackbarOpen(true);
            return [];
        }
        return await response.text();
    }

    const [rows, setRows] = useState([])
    const [rowModesModel, setRowModesModel] = useState({});
    const [tablesToDelete, setTablesToDelete] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [primaryKey, setPrimaryKey] = useState(false);


    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

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
                    Commit Changes
                </Button>
            </GridToolbarContainer>
        );
    }


    useEffect(() => {
        const loadTableStructure = async () => {
            try {
                const ret = await checkIfTableIsEmpty(selectedTable, databaseName);
                if (ret === false) {
                    setIsEmpty(false);
                }
                else {
                    setIsEmpty(true);
                }

                const structure = await fetchStructure(databaseName, selectedTable);
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
        if (databaseName.length > 0 && selectedTable.length > 0) {
            loadTableStructure();
        }
    }, [databaseName, selectedTable]);

    useEffect(() => {
        setRows([]);
    }, [databaseName]);

    useEffect(() => {
        fetchPrimaryKeyName(databaseName, selectedTable).then((data) => {
            setPrimaryKey(data);
        });
    }, []);

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    function handleCommit() {
        let rowsDTO = [];

        rows.forEach(row => {
            if (row.columnName.length >= 3 && row.columnType !== '') {
                rowsDTO.push(row)
            }
        });

        console.log(rowsDTO);
        const userName = getCookie("userName");
        fetch(`http://localhost:8080/api/tableinfo/addFieldInformation/${databaseName}/${selectedTable}/${userName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`,
            },
            body: JSON.stringify(rowsDTO),
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
        const result = rows.find(item => item.id === id)["columnName"];
        if (result === primaryKey) {
            setSnackbarMessage("Cannot delete primary key");
            setSnackbarOpen(true);
            return;
        }
        setTablesToDelete((prevTables) => [...prevTables, id]);
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

    const handleTypeChange = (id, newType) => {
        const updatedRows = rows.map((row) => {
            if (row.id === id) {
                if (row.columnName === primaryKey) {
                    setSnackbarMessage(`Cannot modify primary key ${row.columnName}-${primaryKey}`);
                    setSnackbarOpen(true);
                    return row;
                }
                return { ...row, columnType: newType };
            }
            return row;
        });
        setRows(updatedRows);
    };

    const isCellEditable = (params) => {
        return params.row.columnName !== primaryKey;
    };

    const columns = [
        {
            field: 'columnName',
            headerName: 'columnName',
            width: 180,
            editable: true,
            renderCell: (params) => {
                const isPrimaryKey = params.row.columnName === primaryKey;
                return (
                    <div style={{ fontWeight: isPrimaryKey ? 'bold' : 'normal', color: isPrimaryKey ? '#1976d2' : 'inherit' }}>
                        {params.value}
                        {isPrimaryKey && (
                            <span style={{ marginLeft: '8px', color: '#1976d2' }}>🔑</span>
                        )}
                    </div>
                );
            },
        },
        {
            field: 'columnType',
            headerName: 'columnType',
            width: 150,
            renderCell: (params) => {
                const isPrimaryKey = params.row.columnName === primaryKey;
                return (
                    <FormControl fullWidth>
                        <InputLabel
                            id={`select-label-${params.id}`}
                            style={{marginTop: '10px'}}
                        >
                            Type
                        </InputLabel>
                        <Select
                            labelId={`select-label-${params.id}`}
                            value={params.value}
                            style={{height: '30px', marginTop: '15px'}}
                            onChange={(event) => handleTypeChange(params.id, event.target.value)}
                            variant={"outlined"}
                            disabled={isPrimaryKey}
                        >
                            <MenuItem value="Long">Long</MenuItem>
                            <MenuItem value="Integer">Integer</MenuItem>
                            <MenuItem value="Double">Double</MenuItem>
                            <MenuItem value="Number">Number</MenuItem>
                            <MenuItem value="Boolean">Boolean</MenuItem>
                            <MenuItem value="String">String</MenuItem>
                        </Select>
                    </FormControl>
                )
            },
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

    const columnsForEmpty = [
        { field: 'columnName', headerName: 'columnName', width: 180, editable: true },
        {
            field: 'columnType',
            headerName: 'columnType',
            width: 150,
            editable: false
        },
    ];

    const processRowUpdate = (newRow) => {

        if (newRow["columnName"].length < 3 || newRow["columnType"].length < 1) {
            return null;
        }

        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    return (
        <div>
            {
                isEmpty === true && columns.length > 0 && (

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
                            isCellEditable={isCellEditable}
                            slots={{toolbar: EditToolbar}}
                            slotProps={{
                                toolbar: {setRows, setRowModesModel},
                            }}
                        />
                    </Box>
                )
            }
            {
                isEmpty === false && columnsForEmpty.length > 0 && (
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
                        <div className="alert alert-warning">
                            <strong>Action Not Allowed:</strong> Cannot delete or modify types in a non-empty table.
                        </div>
                        <DataGrid
                            rows={rows}
                            columns={columnsForEmpty}
                            editMode="row"
                            rowModesModel={rowModesModel}
                            onRowModesModelChange={handleRowModesModelChange}
                            onRowEditStop={handleRowEditStop}
                            processRowUpdate={processRowUpdate}
                            isCellEditable={isCellEditable}
                            slotProps={{
                                toolbar: {setRows, setRowModesModel},
                            }}
                        />
                    </Box>
                )
            }

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <MuiAlert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
}

export default DataGridTable;
