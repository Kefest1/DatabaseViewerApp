import React, {useEffect, useState} from 'react';
import './DbTable.css';
import {exportCsv, exportJson, exportXml} from './DataImportExport';
import {getCookie} from "../../../getCookie";


const DbTable = ({ data, tableName, databaseName, selectedColumns }) => {

    const userName = getCookie("userName");
    const [newRow, setNewRow] = React.useState(data);
    const [crossedOutRows, setCrossedOutRows] = useState([]);
    const [toDeleteRows, setToDeleteRows] = useState([]);
    const [dataTypesBuf, setDataTypesBuf] = useState([]);

    const rowsBuf = data.map((row) => {
        return row.reduce((acc, current) => {
            acc[current.columnName] = current.dataValue;
            return acc;
        }, {});
    });

    const checkTableConnectionInfo = async () => {
        const response = await fetch(`http://localhost:8080/api/tableconnection/getconnectedtables/${databaseName}/${tableName}/${userName}`);
        return await response.json();
    }


    const findTableName = async (searchTableName) => {
        const connectedTables = await checkTableConnectionInfo();

        const matchingIds = connectedTables.filter((item) => item.many.tableName === searchTableName).map((item) => item.one.id);
        const matchingTableNames = connectedTables.filter((item) => item.many.tableName === searchTableName).map((item) => item.one.tableName);
        const matchingManyColumnNames = connectedTables.filter((item) => item.many.tableName === searchTableName).map((item) => item.manyColumnName);
        const matchingOneColumnNames = connectedTables.filter((item) => item.many.tableName === searchTableName).map((item) => item.oneColumnName);
        return [matchingIds, matchingTableNames, matchingManyColumnNames, matchingOneColumnNames];
    }

    const [tableConnections, setTableConnections] = useState({});

    useEffect(() => {
        findTableName(tableName).then((res) => {
            setTableConnections(res);
        });
    }, [tableName]);

    useEffect(() => {
        const rowsBuf = data.map((row) => {
            return row.reduce((acc, current) => {
                acc[current.columnName] = current.dataValue;
                return acc;
            }, {});
        });
        setRows(rowsBuf);
        setRowCopy(rowsBuf);
    }, [data]);

    const [rows, setRows] = useState(rowsBuf);
    const [rowCopy, setRowCopy] = useState(rowsBuf);


    const joinColumn = async (id, tableToJoin, matchingManyColumnName, matchingOneColumnName, dataTypes) => {
        const response = await fetch(`http://localhost:8080/api/tableinfo/getFields/${userName}/${databaseName}/${tableToJoin}`);
        const result = await response.json();
        const groupedData = {};

        result.forEach((item) => {
            const columnId = item.columnId;
            if (!groupedData[columnId]) {
                groupedData[columnId] = {};
            }
            groupedData[columnId][item.columnName] = item.dataValue;
        });

        const transformedResult = Object.values(groupedData).map((row) => {
            const obj = {};
            Object.keys(row).forEach((key) => {
                obj[key] = row[key];
            });
            return obj;
        });

        const joinedData = rows.map((row) => {
            const matchingValue = row[matchingManyColumnName];
            const matchingRow = transformedResult.find((transformedRow) => transformedRow[matchingOneColumnName] === matchingValue);
            if (matchingRow) {
                return { ...row, ...matchingRow };
            } else {
                return row;
            }
        });

        let keyNames = [];
        joinedData.forEach(obj => {
            Object.keys(obj).forEach(key => {
                if (!keyNames.includes(key)) {
                    keyNames.push(key);
                }
            });
        });

        console.log(result[0]);
        const dataTypesMany = [];
        let i = 0;

        while (result[i].columnId === result[0].columnId) {
            console.log(result[i].columnName);
            console.log(matchingOneColumnName[0]);
            if (result[i].columnName !== matchingOneColumnName[0]) {
                dataTypesMany.push(result[i].dataType);
            }
            i++;
        }




        console.log(dataTypes);
        console.log(dataTypesMany);
        console.log(dataTypes.concat(dataTypesMany));

        console.log(joinedData);
        console.log(keyNames);

    };


    const [updatedRows, setUpdatedRows] = useState([]);

    const handleAddRow = () => {
        const row = {};
        setNewRow([...rows, newRow]);
    };
    const [searchQueries, setSearchQueries] = useState({});
    const [searchRows, setSearchRows] = useState([]);


    const handleSearch = (columnName, newValue) => {
        setRows(rowCopy);
        setSearchQueries((prevSearchQueries) => ({
            ...prevSearchQueries,
            [columnName]: newValue,
        }));
        setSearchRows((prevSearchRows) => {
            const existingIndex = prevSearchRows.findIndex((row) => row.columnName === columnName);
            if (existingIndex !== -1) {
                if (newValue !== '') {
                    prevSearchRows[existingIndex] = { columnName, newValue };
                } else {
                    prevSearchRows.splice(existingIndex, 1);
                }
            } else if (newValue !== '') {
                prevSearchRows.push({ columnName, newValue });
            }
            return [...prevSearchRows];
        });
    };

    const filterData = () => {
        const filteredRows = rows.filter((row) => {
            return columns.every((column) => {
                const columnName = column.accessor;
                const searchValue = searchQueries[columnName];
                if (searchValue === undefined) return true;
                const rowValue = row[columnName];
                return rowValue.toString().toLowerCase().includes(searchValue.toLowerCase());
            });
        });
        setRows(filteredRows);
    };

    useEffect(() => {
        filterData();
    }, [searchRows]);

    const Debug = () => {
        console.log(searchRows);
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

    const handleSort = (accessor) => {
        const sortedRows = [...rows].sort((a, b) => {
            if (a[accessor] < b[accessor]) return -1;
            if (a[accessor] > b[accessor]) return 1;
            return 0;
        });
        setRows(sortedRows);
        setRowCopy(sortedRows);
    };

    const [editedFields, setEditedFields] = useState({});
    const columns = data[0].map((column) => {

        const isMatchingColumnName = tableConnections[3] && tableConnections[3].includes(column.columnName);

        const columnId = column.columnId;
        const dataTypes = data.flatMap(sublist => sublist.filter(node => node.columnId === columnId).map(node => node.dataType));
        // setDataTypesBuf(dataTypes);

        return {
            Header: (
                <span>
                {column.columnName}
                    {isMatchingColumnName && (
                        <button
                            style={{
                                marginLeft: 10,
                                backgroundColor: '#4CAF50',
                                color: '#ffffff',
                                padding: '5px 10px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                            onClick={() => joinColumn(tableConnections[0], tableConnections[1], tableConnections[2], tableConnections[3], dataTypes)}
                        >
                            {tableConnections[0]} {tableConnections[1]} {tableConnections[2]} {tableConnections[3]}
                        </button>
                    )}
        </span>
            ),
            accessor: column.columnName,
            Footer: column.dataType,
        };
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
                        <span>
                            {column.Header}
                        <br/>
                        <small>({column.Footer})</small>
                        </span>
                            <button onClick={(e) => handleSort(column.accessor)}>Sort by row</button>

                            <input
                                type="search"
                                value={searchQueries[column.accessor] || ''}
                                onChange={(e) => {
                                    setSearchQueries((prevSearchQueries) => ({
                                        ...prevSearchQueries,
                                        [column.accessor]: e.target.value,
                                    }));
                                    handleSearch(column.Header, e.target.value);
                                }}
                                placeholder="Search..."
                                style={{
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                }}
                            />
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