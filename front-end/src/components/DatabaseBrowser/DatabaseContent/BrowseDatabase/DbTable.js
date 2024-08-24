import React, { useState } from 'react';
import './DbTable.css';
import {exportCsv, exportJson, exportXml} from './DataImportExport';

const DbTable = ({ data }) => {
    const [newRow, setNewRow] = React.useState(data);
    const [crossedOutRows, setCrossedOutRows] = useState([]);
    const [toDeleteRows, setToDeleteRows] = useState([]);

    const rowsBuf = data.map((row) => {
        return row.reduce((acc, current) => {
            acc[current.columnName] = current.dataValue;
            return acc;
        }, {});
    });

    const [rows, setRows] = useState(rowsBuf);

    const [updatedRows, setUpdatedRows] = useState([]);

    const handleAddRow = () => {
        const row = { /* initialize new row with default values */ };
        setNewRow([...rows, newRow]);

    };

    const Debug = () => {
        console.log("----------------");
        console.log(rows);
        sortByKey("description");
        console.log(rows);
        console.log("----------------");
    }

    const commitChanges = () => {
        commitUpdate();
        commitDelete();
    }

    const commitDelete = () => {

        fetch('http://localhost:8080/api/fieldinfo/deleteArray', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(toDeleteRows)
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    };

    const commitUpdate = () => { // TODO remove duplicates before sending
        fetch('http://localhost:8080/api/fieldinfo/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedRows),
        })
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    };

    function sortByKey(key) {
        return rows.sort((a, b) => {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        });
    }

    const handleDelete = (rowIndex) => {
        console.log(data[rowIndex][0].columnId);
        const tableIndex = data[rowIndex][0].columnId;

        if (crossedOutRows.includes(rowIndex)) {
            setCrossedOutRows(crossedOutRows.filter((index) => index !== rowIndex));
        } else {
            setCrossedOutRows([...crossedOutRows, rowIndex]);
        }

        if (toDeleteRows.includes(tableIndex)) {
            setToDeleteRows(toDeleteRows.filter((index) => index !== tableIndex));
        } else {
            setToDeleteRows([...toDeleteRows, tableIndex]);
        }
        console.log(crossedOutRows);
    };

    const handleSort = (rowIndex) => {
        console.log(rows);
        const sortedRows = [...rows].sort((a, b) => {
            if (a[rowIndex] < b[rowIndex]) return -1;
            if (a[rowIndex] > b[rowIndex]) return 1;
            return 0;
        });
        setRows(sortedRows);
    };

    const [editedFields, setEditedFields] = useState({});

    const columns = data[0].map((column) => ({
        Header: column.columnName,
        accessor: column.columnName,
        Footer: column.dataType,
    }));



    const handleInputChange = (columnName, rowIndex, value) => {
        setEditedFields((prevEditedFields) => ({
            ...prevEditedFields,
            [columnName + '_' + rowIndex]: {
                columnId: data[rowIndex].columnId,
                newValue: value,
            },
        }));

        const rowID = data[rowIndex][0].columnId;

        const updatePayload = {
            columnName: columnName,
            rowIndex: rowID,
            newDataValue: value,
        };

        setUpdatedRows([...updatedRows, updatePayload]);
        console.log(updatePayload);


        /*fetch('http://localhost:8080/api/fieldinfo/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatePayload),
        })
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error(error));
            */
    };

    return (
        <div className="container">
            <div className="button-group">
                <button
                    style={{
                        backgroundColor: '#4CAF50',
                        color: '#ffffff',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                    onClick={handleAddRow}
                >
                    Add Row
                </button>

                <button
                    onClick={() => exportCsv(data)}
                    className="btn btn-primary"
                >
                    Export to CSV
                </button>

                <button
                    onClick={() => exportXml(data)}
                    className="btn btn-success"
                >
                    Export to Xml
                </button>

                <button
                    onClick={() => exportJson(data)}
                    className="btn btn-info"
                >
                    Export to JSON
                </button>

                <button
                    onClick={() => commitChanges(data)}
                    className="btn btn-info"
                >
                    Commit
                </button>

                <button
                    onClick={() => Debug()}
                    className="btn btn-info"
                >
                    Debug
                </button>

            </div>
            <table className="db-table">
                <thead>

                <tr>
                    {columns.map((column) => (
                        <th key={column.accessor} className="db-table-header">
                            {column.Header}
                            <br/>
                            <small>({column.Footer})</small>
                            <button onClick={(e) => handleSort(column.Header)}>Sort by row</button>
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map((row, index) => (
                    <tr key={index} className={`db-table-row ${crossedOutRows.includes(index) ? 'crossed-out' : ''}`}>
                        {columns.map((column) => (
                            <td
                                key={column.accessor}
                                className="db-table-cell"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleInputChange(column.accessor, index, e.target.innerText)}
                            >
                                {row[column.accessor]}
                            </td>
                        ))}
                        <td>
                            <button onClick={(e) => handleDelete(index)}>Del</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default DbTable;