import React, { useState } from 'react';
import './DbTable.css';
import {exportCsv, exportJson, exportXml} from './DataImportExport';

const DbTable = ({ data }) => {
    const [newRow, setNewRow] = React.useState(data);

    const handleAddRow = () => {
        const row = { /* initialize new row with default values */ };
        setNewRow([...rows, newRow]);

    };

    const handleDelete = (rowIndex) => {
        const columnId = data[rowIndex][0].columnId;
        console.log(columnId);
        fetch('http://localhost:8080/api/fieldinfo/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                mode: 'no-cors'
            },
            body: JSON.stringify(columnId)
        })
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    }

    const [editedFields, setEditedFields] = useState({});
    console.log(data)
    const columns = data[0].map((column) => ({
        Header: column.columnName,
        accessor: column.columnName,
        Footer: column.dataType,
    }));

    const rows = data.map((row) => {
        return row.reduce((acc, current) => {
            acc[current.columnName] = current.dataValue;
            return acc;
        }, {});
    });

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

        fetch('http://localhost:8080/api/fieldinfo/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatePayload),
        })
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error(error));
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

            </div>
            <table className="db-table">
                <thead>

                <tr>
                    {columns.map((column) => (
                        <th key={column.accessor} className="db-table-header">
                            {column.Header}
                            <br/>
                            <small>({column.Footer})</small>
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map((row, index) => (
                    <tr key={index} className="db-table-row">
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
