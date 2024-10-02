import React from 'react';

import {
    DataGrid
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

function Button1DbContent({ data, fetchTime, tableName, databaseName, selectedColumns }) {
    function processData(data) {
        const rows = [];
        const columns = {};

        data.forEach((row, rowIndex) => {
            const rowObj = {id: row[0].columnId};
            row.forEach((column) => {
                rowObj[column.columnName] = column.dataValue;
                if (!columns[column.columnName]) {
                    columns[column.columnName] = {
                        field: column.columnName,
                        headerName: column.columnName,
                        width: column.dataValue.length * 10,
                        hide: column.columnName === 'columnId',
                    };
                } else {
                    const maxLength = Math.max(columns[column.columnName].width, column.dataValue.length * 10);
                    columns[column.columnName].width = maxLength;
                }
            });

            columns['actions'] = {
                field: 'actions',
                headerName: 'Actions',
                width: 100,
                renderCell: (params) => (
                    <button onClick={() => console.log(params.row.id)}>
                        <DeleteIcon />
                    </button>
                ),
            };

            rows.push(rowObj);
        });

        return {rows, columns: Object.values(columns)};
    }


    const {rows, columns} = processData(data);

    return (
        <Box sx={{height: 400, width: 1100}}>
            <DataGrid
                rows={rows}
                columns={columns}
                minColumnWidth={100}
            />
        </Box>
    );

}

export default Button1DbContent;
