import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
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
import { getCookie } from "../../../getCookie";
import {CircularProgress, IconButton, Snackbar, SnackbarContent} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { InfoIcon } from "lucide-react";

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

function TableBrowserNew({ data, fetchTime, tableName, databaseName, selectedColumns, primaryKey, tableStructure, setData, setIsOcc }) {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [selectedRowsIndex, setSelectedRowsIndex] = useState([]);
    const [deletedRows, setDeletedRows] = useState([]);

    const [fieldsToUpdate, setFieldsToUpdate] = useState([]);
    const [newRows, setNewRows] = useState([]);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("");

    const [test, setTest] = useState(0);
    const testRef = useRef(test);

    const [updatedRows, setUpdatedRows] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        testRef.current = test;

        const intervalId = setInterval(() => {
            setTest(1);
        }, 1000);


        return () => {
            clearInterval(intervalId);
            const userName = getCookie("userName");
            if (testRef.current === 1) {
                console.log("Pop position");
                fetch(`http://localhost:8080/api/accesscontroller/popPosition/${databaseName}/${tableName}/${userName}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
                    }
                });
                setIsOcc(false);
            }
            setData(() => ({
                insert: [],
                update: []
            }));
        };
    }, [test]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            console.log("Pop position");

            fetch(`http://localhost:8080/api/accesscontroller/popPosition/${databaseName}/${tableName}/${getCookie("userName")}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });
            setIsOcc(false);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const logUpdatable = async () => {
        setLoading(true);
        console.log(fieldsToUpdate);
        try {
            if (fieldsToUpdate.length === 0) {
                setMessage("No fields to update");
                setOpenSnackbar(true);
                setLoading(false);
                return;
            }

            const token = localStorage.getItem("jwtToken");
            const response = await fetch('http://localhost:8080/api/fieldinfo/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(fieldsToUpdate),
            });
            QueryLogger.addLog(`Updated table ${tableName}\'s ${fieldsToUpdate.length} rows`, logging_level.UPDATE);

            if (!response.ok) {
                setLoading(false);
                throw new Error('Network response was not ok');
            }

            const result = await response.text();
            setData(prevData => ({
                ...prevData,
                update: []
            }));
            console.log(result);

            setUpdatedRows([]);

            setMessage("Fields updated successfully");
            setOpenSnackbar(true);
            setLoading(false);
        } catch (error) {
            setMessage("Failed to update fields");
            setOpenSnackbar(true)
            setLoading(false);
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
                const isMarkedForDeletion = deletedRows.includes(id);

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
                        disabled={isMarkedForDeletion}
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
        if (id < 0) {
            setRows(rows.filter((row) => row.id !== id));
            setNewRows(newRows.filter((row) => row.id !== id));
            return;
        }
        if (deletedRows.includes(id)) {
            setDeletedRows(deletedRows.filter(rowId => rowId !== id));
            setSelectedRowsIndex(selectedRowsIndex.filter(rowId => rowId !== id));
        } else {
            setDeletedRows([...deletedRows, id]);
            setSelectedRowsIndex([...selectedRowsIndex, id]);
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

    const processRowUpdate = (newRow, originalRow) => {
        console.log(newRow);
        console.log(originalRow);
        let differences = {};
        for (const key in newRow) {
            if (newRow[key] !== originalRow[key]) {
                differences[key] = { newRow: newRow[key], originalRow: originalRow[key] };
            }
        }

        if (Object.keys(differences).length === 0) {
            return { ...newRow}
        }

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

            setUpdatedRows(prevUpdatedRows => [...prevUpdatedRows, originalRow.id]);

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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
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
        setLoading(true);
        const userName = getCookie("userName");

        if (selectedRowsIndex.length === 0) {
            setMessage("No rows selected!");
            setOpenSnackbar(true);
            setLoading(false);
            return;
        }

        selectedRowsIndex.forEach(rowId => {
            if (rowId < 0) {
                setRows(rows.filter(row => row.id !== rowId));
                setNewRows(newRows.filter(row => row.id !== rowId));
            }
        });
        console.log(selectedRowsIndex);
        const buffer = [];
        selectedRowsIndex.forEach(rowId => {
            if (rowId >= 0) {
                buffer.push(rowId);
            }
        });
        console.log(buffer);

        setSelectedRowsIndex(buffer);

        console.log(selectedRowsIndex);
        if (buffer.length === 0) {
            setMessage("Success");
            setOpenSnackbar(true);
            setLoading(false);
            return;
        }

        const selectedCount = selectedRowsIndex.length;

        fetch(`http://localhost:8080/api/fieldinfo/deleteArray/${databaseName}/${tableName}/${primaryKey}/${userName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
            },
            body: JSON.stringify(selectedRowsIndex)
        })
            .then(async response => {
                const res = await response.json();
                console.log(res);
                console.log(rows);
                if (res.length > 0) {
                    if (res.length > 0) {
                        setRows(prevRows => prevRows.filter(row => !res.includes(Number(row.id))));
                        setDeletedRows(prevDeletedRows => prevDeletedRows.filter(id => !res.includes(id)));
                        setSelectedRowsIndex([]);
                    }
                }

                if (res.length > 0) {
                    setData(prevData => ({
                        ...prevData,
                        update: prevData.update.filter(updateRow => !res.includes(Number(updateRow.rowIndex)))
                    }));
                }

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
                setLoading(false);
            })
            .catch(error => {
                setMessage("An error has occured while deleting rows");
                setOpenSnackbar(true);
                setLoading(false);
            });
    };

    const commitInsertNewRows = async () => {
        setLoading(true);
        console.log(newRows);
        const filteredData = newRows.map(({isNew, ...rest }) => rest);
        console.log(filteredData);
        let finalList = [];
        filteredData.forEach(innerArray => {
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
            setLoading(false);
            return;
        }
        console.log(finalList);

        fetch(`http://localhost:8080/api/fieldinfo/insertvalues/${databaseName}/${getCookie("userName")}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
            },
            body: JSON.stringify(finalList)
        })
            .then(async response => {
                setData(prevData => ({
                    ...prevData,
                    insert: []
                }));
                QueryLogger.addLog(`Inserted to table ${tableName} ${finalList.length} rows`, logging_level.INSERT);

                const res = await response.json();
                setMessage("New rows inserted successfully");
                setOpenSnackbar(true);
                setLoading(false);

                const updatedRows = rows.map(row => {
                    const match = res.find(r => r.previousColumnID === row.id);
                    if (match) {
                        return {
                            ...row,
                            id: `${match.newColumnID}`,
                            [primaryKey]: `${match.newPrimaryKeyID}`
                        };
                    }
                    return row;
                });

                setRows(updatedRows);

                setNewRows([]);
            })
            .catch(error => {
                console.error('Error:', error);
                setMessage("Failed to insert new rows updated successfully");
                setOpenSnackbar(true);
                setLoading(false);

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
                <EditToolbar props={{ setRows, setRowModesModel }} />
                <GridToolbar />
                <ImportDataToolbar />
            </GridToolbarContainer>
        );
    };

    function handleRowSelectionChange(e) {
        setSelectedRowsIndex(e);
    }
    const getRowClassName = (params) => {
        let className = '';
        if (deletedRows.includes(params.id)) {
            className += 'deleted-row ';
        }
        if (updatedRows.includes(params.id)) {
            className += 'updated-row ';
        }
        return className.trim();
    };

    function Debug() {
        console.log(rows);
    }

    return (
        <Box sx={{ height: 600, width: 1200 }}>

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

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                    className="button button-update"
                    size="small"
                    color="primary"
                    variant={"contained"}
                    onClick={() => logUpdatable()}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Update Altered Fields'}
                </Button>
                <Button
                    className="button button-delete"
                    size="small"
                    color="secondary"
                    variant={"contained"}
                    onClick={commitDeleteManyRows}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Delete Selected Rows'}</Button>
                <Button
                    className="button button-insert"
                    size="small"
                    color="warning"
                    variant={"contained"}
                    onClick={commitInsertNewRows}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Commit Insertion'}
                </Button>
                <Button
                    className="button button-insert"
                    size="small"
                    color="warning"
                    variant={"contained"}
                    onClick={Debug}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Debug'}
                </Button>
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
                getRowClassName={getRowClassName}
                slots={{
                    toolbar: CustomToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </Box>
    );

    function ImportDataToolbar() {
        const fileInputRef = React.useRef(null);

        const handleClick = () => {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        };

        function transformJSONToInsertPayload(jsonDataString, primaryKey, tableName) {
            const jsonData = JSON.parse(jsonDataString);
            const payloadList = [];

            jsonData.forEach((row) => {
                const rowPayload = [];

                if (!row.hasOwnProperty(primaryKey)) {
                    rowPayload.push({
                        columnName: primaryKey,
                        dataValue: '1',
                        tableName: tableName
                    });
                } else {
                    rowPayload.push({
                        columnName: primaryKey,
                        dataValue: row[primaryKey].toString().trim(),
                        tableName: tableName
                    });
                }

                for (const [key, value] of Object.entries(row)) {
                    if (key !== primaryKey) {
                        rowPayload.push({
                            columnName: key.trim(),
                            dataValue: value ? value.toString().trim() : '',
                            tableName: tableName
                        });
                    }
                }

                payloadList.push(rowPayload);
            });

            return payloadList;
        }

        function transformCSVToInsertPayload(csvContent) {
            const lines = csvContent.split('\n');
            let header = lines[0].split(',');
            const payloadList = [];

            if (!header.includes(primaryKey)) {
                header.push(primaryKey);
            }
            header = header.map(item => item.replace(/\r/g, ''));


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
                console.log(fileType);
                const validTypes = ['text/csv', 'application/json'];

                if (!validTypes.includes(fileType)) {
                    console.error('Invalid file type. Please upload a CSV file.');
                    return;
                }

                const reader = new FileReader();

                reader.onload = async (e) => {
                    const content = e.target.result;
                    console.log(fileType);
                    if (fileType === 'application/json') {
                        console.log('JSON File content:\n', content);
                        const payloadList = transformJSONToInsertPayload(content, primaryKey, tableName);
                        console.log(payloadList);

                        const oldList = [...payloadList];
                        for (let i = 0; i < payloadList.length; i++) {
                            const row = payloadList[i];
                            row.unshift({
                                columnName: "id",
                                dataValue: newId,
                                tableName: tableName
                            })
                            newId--;
                        }
                        let newRows = [];
                        let newRow = {};
                        for (let i = 0; i < oldList.length; i++) {
                            for (let j = 0; j < oldList[i].length; j++) {
                                newRow[oldList[i][j]["columnName"]] = oldList[i][j]["dataValue"];
                            }
                            newRows.push(newRow);
                            newRow = {};
                        }

                        const token = localStorage.getItem("jwtToken");
                        const response = await fetch(`http://localhost:8080/api/fieldinfo/insertvalues/${databaseName}/${getCookie("userName")}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(payloadList),
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }

                        const result = await response.json();
                        console.log(newRows);
                        for (let i = 0; i < newRows.length; i++) {
                            const match = result.find(r => r.previousColumnID === newRows[i].id);

                            newRows[i]["id"] = `${match.newColumnID}`;
                            newRows[i][primaryKey] = `${match.newPrimaryKeyID}`;
                        }
                        console.log(newRows);
                        setRows((oldRows) => [
                            ...newRows,
                            ...oldRows,
                        ]);

                    } else if (fileType === 'text/csv') {
                        console.log('CSV File content:\n', content);
                        const payloadList = transformCSVToInsertPayload(content);
                        console.log(payloadList);

                        const oldList = [...payloadList];
                        for (let i = 0; i < payloadList.length; i++) {
                            const row = payloadList[i];
                            row.unshift({
                                columnName: "id",
                                dataValue: newId,
                                tableName: tableName
                            })
                            newId--;
                        }
                        let newRows = [];
                        let newRow = {};
                        for (let i = 0; i < oldList.length; i++) {
                            for (let j = 0; j < oldList[i].length; j++) {
                                newRow[oldList[i][j]["columnName"]] = oldList[i][j]["dataValue"];
                            }
                            newRows.push(newRow);
                            newRow = {};
                        }

                        const token = localStorage.getItem("jwtToken");
                        const response = await fetch(`http://localhost:8080/api/fieldinfo/insertvalues/${databaseName}/${getCookie("userName")}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(payloadList),
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }

                        const result = await response.json();
                        console.log(newRows);
                        for (let i = 0; i < newRows.length; i++) {
                            const match = result.find(r => r.previousColumnID === newRows[i].id);

                            newRows[i]["id"] = `${match.newColumnID}`;
                            newRows[i][primaryKey] = `${match.newPrimaryKeyID}`;
                        }
                        console.log(newRows);
                        setRows((oldRows) => [
                            ...newRows,
                            ...oldRows,
                        ]);
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

            const newRow = { id };

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
