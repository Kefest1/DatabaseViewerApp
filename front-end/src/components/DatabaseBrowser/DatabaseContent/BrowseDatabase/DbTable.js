import React from 'react';
import './DbTable.css';

const DbTable = ({ data }) => {
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

    return (
        <table className="db-table">
            <thead>
            <tr>
                {columns.map((column) => (
                    <th key={column.accessor} className="db-table-header">
                        {column.Header}
                        <br />
                        <small>({column.Footer})</small>
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {rows.map((row, index) => (
                <tr key={index} className="db-table-row">
                    {columns.map((column) => (
                        <td key={column.accessor} className="db-table-cell">
                            {row[column.accessor]}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default DbTable;