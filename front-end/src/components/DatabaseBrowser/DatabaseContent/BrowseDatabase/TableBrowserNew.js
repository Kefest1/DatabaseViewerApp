import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import UploadFile from '@mui/icons-material/UploadFile';

import {
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridRowModes,
    GridToolbar,
    GridToolbarContainer,
} from '@mui/x-data-grid';
import {getCookie} from "../../../getCookie";

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
            if (x.toLowerCase() === 'number' || x.toLowerCase() === 'long' || x.toLowerCase() === 'integer') {
                col.type = 'number';
            }


            columns.push(col);
        }
    )

    return columns;
}

const logUpdatable = async (fieldsToUpdate) => {
    try {
        const response = await fetch('http://localhost:8080/api/fieldinfo/update', {
            method: 'PUT',
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

let newId = -1;

function TableBrowserNew({ data, ColumnNames, fetchTime, tableName, databaseName, selectedColumns, primaryKey, tableStructure }) {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [selectedRowsIndex, setSelectedRowsIndex] = useState([]);

    const [fieldsToUpdate, setFieldsToUpdate] = useState([]);
    const [newRows, setNewRows] = useState([]);

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

        console.log(finalList);
        fetch(`http://localhost:8080/api/fieldinfo/insertvalues/${databaseName}`,  {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalList)
        })
            .then(response => response.json())
            .catch(error => console.error('Error:', error));
    }

    function processError(params) {
        console.log(params);
    }

    function Debug() {
        console.log(columns);
    }

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
                <Button variant="contained" onClick={() => logUpdatable(fieldsToUpdate)}>Update altered fields</Button>
                <Button variant="contained" onClick={commitDeleteManyRows}>Delete selected rows</Button>
                <Button variant="contained" onClick={commitInsertNewRows}>Commit Insertion</Button>
                <Button variant="contained" onClick={Debug}>Debug</Button>
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
