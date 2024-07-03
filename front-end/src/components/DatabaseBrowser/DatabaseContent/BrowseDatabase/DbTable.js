import React, { useState } from 'react';
import './DbTable.css';
import {exportCsv, exportJson, exportXml} from './DataImportExport';

const DbTable = ({ data }) => {
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
        console.log(`Edited field: Row ${data[rowIndex][0].columnId}`);
    };

    return (
        <div className="container">
            <div className="button-group">
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
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default DbTable;
