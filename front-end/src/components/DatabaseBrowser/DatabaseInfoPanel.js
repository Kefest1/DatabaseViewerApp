import React, { useEffect, useState } from 'react';
import './DatabaseInfoPanel.css';
import { getCookie } from "../getCookie";

async function fetchAvailableDatabases(userName) {
    const tables = await fetch("http://localhost:8080/api/databaseinfo/getfoldermap/" + userName);
    return await tables.json();
}

function organizeData(dataArray) {
    const organizedData = {};

    dataArray.forEach(entry => {
        const [database, table, field] = entry.split(',');

        if (!organizedData[database]) {
            organizedData[database] = {};
        }

        if (!organizedData[database][table]) {
            organizedData[database][table] = [];
        }

        organizedData[database][table].push(field);
    });

    return organizedData;
}

const ColumnName = ({ name }) => {
    return <div style={{ marginLeft: '20px' }}>{name}</div>;
};

const Tables = ({ columns, name }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleFolder = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <div onClick={toggleFolder}>
                {isOpen ? '[-]' : '[+]'} {name}
            </div>
            {isOpen && (
                <div style={{ marginLeft: '20px' }}>
                    {columns.map((item, index) => (
                        <ColumnName key={index} name={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

const Databases = ({ tables, name }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleFolder = () => {
        setIsOpen(!isOpen);
    };

    const tableKeys = Object.keys(tables);

    return (
        <div>
            <div onClick={toggleFolder}>
                {isOpen ? '[-]' : '[+]'} {name}
            </div>
            {isOpen && (
                <div style={{ marginLeft: '20px' }}>
                    {tableKeys.map((key, index) => (
                        <Tables key={index} columns={tables[key]} name={key} />
                    ))}
                </div>
            )}
        </div>
    );
};

const Tree = ({ databases }) => {
    const dbKeys = Object.keys(databases);

    return (
        <div>
            {'Available databases'}
            <div style={{marginLeft: '20px'}}>
                {dbKeys.map((key, index) => (
                    <Databases key={index} tables={databases[key]} name={key}/>
                ))}
            </div>

        </div>
    );
}

const DatabaseInfoPanel = () => {
    const [tablesData, setTablesData] = useState([]);
    const [jsonData, setJsonData] = useState(null);
    const userName = getCookie("userName");

    useEffect(() => {
        fetchAvailableDatabases(userName)
            .then((data) => {
                setTablesData(data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [userName]);

    useEffect(() => {
        if (tablesData.length > 0) {
            const organizedData = organizeData(tablesData);
            setJsonData(organizedData);
        }
    }, [tablesData]);

    return (
        <div style={{ maxHeight: '95%', overflow: 'auto' }}>
            <div style={{ maxHeight: '100%', overflow: 'auto' }}>
                {jsonData ? (
                    <Tree databases={jsonData} />
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

export default DatabaseInfoPanel;
