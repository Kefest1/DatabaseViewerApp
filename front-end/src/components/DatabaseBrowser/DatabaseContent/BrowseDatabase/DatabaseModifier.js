import React, {useEffect, useState} from "react";
import {getCookie} from "../../../getCookie";
import {FormControl, InputLabel, MenuItem} from "@mui/material";
import Select from "@mui/material/Select";
import {
    DataGrid, GridActionsCellItem,
    GridCellEditStopReasons,
    GridRowEditStopReasons,
    GridRowModes,
    GridToolbarContainer
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import {randomId} from "@mui/x-data-grid-generator";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

async function fetchAvailableDatabases() {
    const userName = getCookie("userName");
    const tables = await fetch(
        "http://localhost:8080/api/tableinfo/getAvailableDatabases/" + userName
    );
    return await tables.json();
}

async function fetchDatabaseStructure(selectedDatabase) {
    const userName = getCookie("userName");
    const tables = await fetch(
        "http://localhost:8080/api/databaseinfo/getDatabaseStructure/" + userName + "/" + selectedDatabase
    );
    return await tables.json();
}

let iter = -1;

function DatabaseModifier() {

    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [availableDatabases, setAvailableDatabases] = useState([]);

    const [rowModesModel, setRowModesModel] = useState({});

    const [databaseStructure, setDatabaseStructure] = useState([]);
    const [updatedRows, setUpdatedRows] = useState([]);
    const [selectedRowsIndex, setSelectedRowsIndex] = useState([]);

    const [rows, setRows] = useState([]);
    const columns = [
        {
            field: 'tableName',
            headerName: 'Table Name',
            width: 150,
            editable: true,
        },
        {
            field: 'primaryKey',
            headerName: 'Primary key name',
            width: 150,
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
    ]

    useEffect(() => {
        const loadDatabases = async () => {
            const availableDBs = await fetchAvailableDatabases();
            setAvailableDatabases(availableDBs);
        };

        loadDatabases();
    }, []);

    useEffect(() => {
        const loadDatabaseStructure = async () => {
            if (selectedDatabase !== "") {
                const dbStructure = await fetchDatabaseStructure(selectedDatabase);
                const transformedArray = dbStructure.map(item => item.split(','));
                setDatabaseStructure(transformedArray);
                console.log(transformedArray);
                let finalRows = []
                let iter = 0;

                transformedArray.forEach(triplet => {
                    let node = {}

                    node["id"] = triplet[0];
                    node["tableName"] = triplet[1];
                    node["primaryKey"] = triplet[2];

                    node["isEditable"] = true;

                    iter += 1

                    finalRows.push(node);
                });
                setRows(finalRows);

            }
        }

        loadDatabaseStructure();
    }, [selectedDatabase]);

    function EditToolbar(props) {
        const { setRows, setRowModesModel } = props;

        const handleClick = () => {
            const id = iter;
            iter--;
            setRows((oldRows) => [
                { id, tableName: '', primaryKey: '', isNew: true, isEditable: 'true' },
                ...oldRows,
            ]);
            setRowModesModel((oldModel) => ({
                ...oldModel,
                [id]: { mode: GridRowModes.Edit, fieldToFocus: 'tableName' },
            }));
        };

        const handleDelete = () => {
            console.log(selectedRowsIndex);
            selectedRowsIndex.forEach(index => {
                setRows(rows.filter((row) => row.id !== index));
            })
            fetch(`http://localhost:8080/api/tableinfo/deletetableindexes`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedRowsIndex)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Success:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });

        };

        const commitChanges = () => {
            console.log(rows);
            console.log(updatedRows);

            let negative = []
            let positive = []

            updatedRows.forEach(obj => {
                const id = Number(obj.id);

                if (id < 0) {
                    negative.push(obj);
                }
                else {
                    positive.push(obj);
                }
            });

            console.log(positive);
            console.log(negative);

            negative.forEach(obj => {
                const userName = getCookie("userName");

                const params = new URLSearchParams();
                params.append('tableName', obj.tableName);
                params.append('databaseName', selectedDatabase);
                params.append('primaryKey', obj.primaryKey);
                params.append('username', userName);


                fetch(`http://localhost:8080/api/tableinfo/addenhanced`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: params.toString()
                })
                    .then(response => response.json())
                    .catch(error => console.error('Error:', error));
            });

            positive.forEach(obj => {
                const userName = getCookie("userName");

                const requestBody = {
                    tableName: obj.oldTableName,
                    newTableName: obj.tableName,
                    databaseName: selectedDatabase,
                    primaryKey: obj.primaryKey,
                    username: userName
                };

                fetch(`http://localhost:8080/api/tableinfo/updateTable`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Success:', data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            })
        };

        return (
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                    Add record
                </Button>
                {/*<Button color="primary" startIcon={<AddIcon />} onClick={commitChanges}>*/}
                <Button color="primary"  onClick={commitChanges}>
                    Commit changes
                </Button>
                <Button color="primary"  onClick={handleDelete}>
                    Commit delete
                </Button>
            </GridToolbarContainer>
        );
    }

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        console.log(id);
        fetch(`http://localhost:8080/api/tableinfo/deletetable`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                setRows(rows.filter((row) => row.id !== id));
            })
            .catch(error => {
                console.error('Error:', error);
            });
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

    function compareObject(newRow, oldRow) {
        if (typeof newRow !== 'object' || newRow === null || typeof oldRow !== 'object' || oldRow === null) {
            return false;
        }

        const keys1 = Object.keys(newRow);
        const keys2 = Object.keys(oldRow);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (let key of keys1) {
            if (newRow[key] !== oldRow[key]) {
                return false;
            }
        }

        return true;
    }

    const processRowUpdate = (newRow, oldRow) => {
        console.log(oldRow);
        const updatedRow = {...newRow, isNew: false, oldTableName: oldRow["tableName"]};
        if (!compareObject(oldRow, newRow)) {
            setUpdatedRows([...updatedRows, updatedRow])
            setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        }

        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    return (
        <div style={{width: '90%'}}>
            <FormControl variant="outlined">
                <InputLabel id="demo-simple-select-table">Select a Database</InputLabel>
                <Select
                    labelId="demo-simple-select-table"
                    id="demo-simple-table"
                    value={selectedDatabase}
                    label="Select Table"
                    onChange={(event) => setSelectedDatabase(event.target.value)}
                    variant={"outlined"}
                    style={{width: "200px"}}
                >
                    {availableDatabases.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {
                selectedDatabase !== "" &&
                (
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        editMode="row"
                        isCellEditable={(params) => true}
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        checkboxSelection
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setSelectedRowsIndex(newRowSelectionModel);
                        }}
                        slots={{ toolbar: EditToolbar }}
                        slotProps={{
                            toolbar: { setRows, setRowModesModel },
                        }}
                    />
                )

            }
        </div>
    )
}

export default DatabaseModifier;
