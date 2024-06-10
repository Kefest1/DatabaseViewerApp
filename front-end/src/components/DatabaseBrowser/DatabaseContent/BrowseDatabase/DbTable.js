import React from 'react';

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
        <table>
            <thead>
            <tr>
                {columns.map((column) => (
                    <th key={column.accessor}>
                        {column.Header}
                        <br />
                        <small>({column.Footer})</small>
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {rows.map((row, index) => (
                <tr key={index}>
                    {columns.map((column) => (
                        <td key={column.accessor}>{row[column.accessor]}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default DbTable;