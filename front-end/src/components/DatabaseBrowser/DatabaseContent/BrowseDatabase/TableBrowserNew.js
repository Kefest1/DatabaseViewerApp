import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import UploadFile from '@mui/icons-material/UploadFile';
import QueryLogger, { logging_level } from './QueryLogger';
import './TableBrowserNew.css';
import {
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridRowModes,
    GridToolbar,
    GridToolbarContainer,
} from '@mui/x-data-grid';
import {getCookie} from "../../../getCookie";
import {IconButton, Snackbar, SnackbarContent} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import {InfoIcon} from "lucide-react";

function getColumnTypeByName(cols, columnName) {
    let type = null;
    cols.forEach(
        column => {
            if (column.columnName === columnName) {
                type = column.columnType;
            }
        }
    )

    return type;
}

function prepareColumns(selectedColumns, primaryKey, tableStructure) {
    let columns = [];

    selectedColumns.forEach(
        columnName => {
            let col = {
                field: columnName,
                headerName: columnName,
                width: 100,
                editable: (columnName !== primaryKey),
                align: 'left',
                headerAlign: 'left'
            }
            const x = getColumnTypeByName(tableStructure, columnName);
            try {
                if (x.toLowerCase() === 'number' || x.toLowerCase() === 'long' || x.toLowerCase() === 'integer') {
                    col.type = 'number';
                }
            } catch (e) {
                console.log(e)
            }


            columns.push(col);
        }
    )

    return columns;
}


let newId = -1;

function TableBrowserNew({ data, fetchTime, tableName, databaseName, selectedColumns, primaryKey, tableStructure, setData }) {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [selectedRowsIndex, setSelectedRowsIndex] = useState([]);

    const [fieldsToUpdate, setFieldsToUpdate] = useState([]);
    const [newRows, setNewRows] = useState([]);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("");

    const [test, setTest] = useState(0);
    const testRef = useRef(test);

    useEffect(() => {
        testRef.current = test;

        const intervalId = setInterval(() => {
            setTest(1);
        }, 1000);


        return () => {
            clearInterval(intervalId);
            const userName = getCookie("userName");
            if (testRef.current === 1) {
                fetch(`http://localhost:8080/api/accesscontroller/popPosition/${databaseName}/${tableName}/${userName}`);
            }
        };
    }, [test]);

    const logUpdatable = async () => {
        try {
            if (fieldsToUpdate.length === 0) {
                setMessage("No fields to update");
                setOpenSnackbar(true);
                return;
            }
            const response = await fetch('http://localhost:8080/api/fieldinfo/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fieldsToUpdate),
            });
            QueryLogger.addLog(`Updated table ${tableName}\'s ${fieldsToUpdate.length} rows`, logging_level.UPDATE);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.text();
            setData(prevData => ({
                ...prevData,
                update: []
            }));
            console.log(result);

            setMessage("Fields updated successfully");
            setOpenSnackbar(true);
        } catch (error) {
            setMessage("Failed to update fields");
            setOpenSnackbar(true);
            console.error('Error:', error);
        }
    };

    let columns = prepareColumns(selectedColumns, primaryKey, tableStructure);
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

    const processData = (data, setRows) => {
        const rows = [];

        data.forEach((row) => {
            const rowObj = { id: row[0].columnId };
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


    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
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
        const updatedRow = { ...newRow, isNew: false };
        const contains = newRows.some(row => row.id === newRow.id);

        setNewRows(prevRows => {
            if (contains) {
                return prevRows.map(row => (row.id === newRow.id ? updatedRow : row));
            } else {
                return [...prevRows, updatedRow];
            }
        });

        setRows(rows.map(row => (row.id === newRow.id ? updatedRow : row)));

        if (newRow.id < 0 || originalRow.id < 0) {
            return updatedRow;
        } else {
            let request = findDifference(originalRow, updatedRow);
            request["rowIndex"] = originalRow.id;
            setFieldsToUpdate(prevFields => [...prevFields, request]);
            if ('columnName' in request) {
                setData(prevData => ({
                    ...prevData,
                    update: [...prevData.update, request]
                }));
            }
            return updatedRow;
        }
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const commitDeleteSingleRow = (params) => {
        console.log(params);
        if (params < 0) {
            return;
        }
        QueryLogger.addLog(`Deleted one row from table ${tableName}`, logging_level.DELETE);

        fetch(`http://localhost:8080/api/fieldinfo/deleteArray/${databaseName}/${tableName}/${primaryKey}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([params])
        })
            .then(response => {
                const res = response.text();
                console.log(res);
            })
            .catch(error => console.error('Error:', error));
    };

    const commitDeleteManyRows = () => {
        console.log(selectedRowsIndex);
        const selectedCount = selectedRowsIndex.length;
        if (selectedCount === 0) {
            setMessage("No rows selected!");
            setOpenSnackbar(true);
            return;
        }

        fetch(`http://localhost:8080/api/fieldinfo/deleteArray/${databaseName}/${tableName}/${primaryKey}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedRowsIndex)
        })
            .then(async response => {
                const res = await response.json();
                console.log(res);
                res.forEach((num) => {
                    setRows(rows.filter((row) => row.id !== num));
                });

                QueryLogger.addLog(`Deleted from table ${tableName} ${res.length} rows`, logging_level.DELETE);

                if (res.length === 0) {
                    setMessage("No rows were deleted");
                }
                else if (selectedCount === res.length) {
                    setMessage("All selected rows deleted successfully");
                }
                else if (selectedCount > res.length) {
                    setMessage("Some rows were not deleted");
                }

                setOpenSnackbar(true);
            })
            .catch(error => console.error('Error:', error));
    };

    const commitInsertNewRows = () => {
        const filteredData = newRows.map(({ id, isNew, ...rest }) => rest);
        let finalList = [];
        filteredData.forEach(innerArray => {
            console.log(innerArray);
            let nodeList = [];

            for (let key in innerArray) {
                if (innerArray.hasOwnProperty(key)) {
                    nodeList.push({
                        columnName: key,
                        dataValue: innerArray[key],
                        tableName: tableName
                    })
                }
            }

            finalList.push(nodeList);
        });

        if (finalList.length === 0) {
            setMessage("No rows awaiting to be sent!");
            setOpenSnackbar(true);
            return;
        }

        fetch(`http://localhost:8080/api/fieldinfo/insertvalues/${databaseName}`,  {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalList)
        })
            .then(response => {
                setData(prevData => ({
                    ...prevData,
                    insert: []
                }));
                QueryLogger.addLog(`Inserted to table ${tableName} ${finalList.length} rows`, logging_level.INSERT);
                const res = response.text();
                setMessage("New rows inserted successfully");
                setOpenSnackbar(true);
            })
            .catch(error => {
                console.error('Error:', error);
                setMessage("Failed to insert new rows updated successfully");
                setOpenSnackbar(true);
            });
    }

    function processError(params) {
        console.log(params);
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const CustomToolbar = ({ setRows, setRowModesModel }) => {
        return (
            <GridToolbarContainer>
                <EditToolbar props={{setRows, setRowModesModel}} />
                <GridToolbar />
                <ImportDataToolbar />
            </GridToolbarContainer>
        );
    };

    function handleRowSelectionChange(e) {
        setSelectedRowsIndex(e);
    }

    return (
        <Box sx={{ height: 600, width: 1200 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button className="button button-update" color="primary" variant={"contained"} onClick={() => logUpdatable()}>Update Altered Fields</Button>
                <Button className="button button-delete" color="secondary" variant={"contained"} onClick={commitDeleteManyRows}>Delete Selected Rows</Button>
                <Button className="button button-insert" color="warning" variant={"contained"} onClick={commitInsertNewRows}>Commit Insertion</Button>
            </Box>
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                checkboxSelection
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                onRowSelectionModelChange={handleRowSelectionChange}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={processError}
                slots={{
                    toolbar: CustomToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <SnackbarContent
                    style={{ backgroundColor: '#4365da' }}
                    message={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <InfoIcon style={{ marginRight: 8 }} />
                            {message}
                        </span>
                    }
                    action={[
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            onClick={handleCloseSnackbar}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </Snackbar>
        </Box>
    );

    function ImportDataToolbar() {
        const fileInputRef = React.useRef(null);

        const handleClick = () => {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        };

        function transformCSVToInsertPayload(csvContent) {
            const lines = csvContent.split('\n');
            let header = lines[0].split(',');
            const payloadList = [];

            if (!header.includes(primaryKey)) {
                header.push(primaryKey);
            }
            header = header.map(item => item.replace(/\r/g, ''));

            console.log(header);

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    const values = line.split(',');
                    const rowPayload = [];

                    for (let j = 0; j < header.length; j++) {
                        if (header[j].trim() === primaryKey) {
                            const payload = {
                                columnName: primaryKey,
                                dataValue: '1',
                                tableName: tableName
                            };
                            rowPayload.push(payload);
                        }
                        else {
                            const payload = {
                                columnName: header[j].trim(),
                                dataValue: values[j] ? values[j].trim() : '',
                                tableName: tableName
                            };
                            rowPayload.push(payload);
                        }
                    }

                    payloadList.push(rowPayload);
                }
            }

            return payloadList;
        }

        const handleFileChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const fileType = file.type;
                const validTypes = ['application/json', 'text/csv', 'application/xml', 'text/xml'];

                if (!validTypes.includes(fileType)) {
                    console.error('Invalid file type. Please upload a JSON, CSV, or XML file.');
                    return;
                }

                const reader = new FileReader();

                reader.onload = async (e) => {
                    const content = e.target.result;
                    console.log(fileType);
                    if (fileType === 'application/json') {
                        console.log('JSON File content:\n', content);
                        // Further process the JSON content here
                    } else if (fileType === 'text/csv') {
                        console.log('CSV File content:\n', content);
                        const payloadList = transformCSVToInsertPayload(content);
                        console.log(payloadList);
                        const response = await fetch(`http://localhost:8080/api/fieldinfo/insertvalues/${databaseName}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(payloadList),
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }

                        const result = await response.text();
                        console.log(result);

                    } else if (fileType === 'application/xml' || fileType === 'text/xml') {
                        console.log('XML File content:\n', content);
                    }
                };

                reader.readAsText(file);
            }
        };

        return (
            <GridToolbarContainer>
                <Button color="primary" startIcon={<UploadFile />} onClick={handleClick}>
                    Import From File
                </Button>
                <input
                    type="file"
                    accept=".json,.csv,.xml"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
            </GridToolbarContainer>
        );
    }

    function EditToolbar() {

        const handleClick = () => {
            const id = newId;
            newId--;

            const newRow = {id};

            selectedColumns.forEach(
                (column) => {
                    if (column === primaryKey) {
                        newRow[column] = 'will be generated';
                    }
                    else {
                        newRow[column] = '';
                    }
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
            setData(prevData => ({
                ...prevData,
                insert: [...prevData.insert, newRow]
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
