import React, {useEffect, useState} from 'react';
import './DatabaseInfoPanel.css';
import {getCookie} from "../getCookie";

async function fetchAvailableDatabases(userName) {

    const token = localStorage.getItem("jwtToken");

    const tables = await fetch("http://localhost:8080/api/databaseinfo/getfoldermap/" + userName, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return await tables.json();
}

const transformToNestedStructure = (data) => {
    const result = [];

    data.forEach((path) => {
        const pathParts = path.split(',');
        let currentLevel = result;

        pathParts.forEach((part, index) => {
            const existingFolder = currentLevel.find((item) => item.name === part);

            if (existingFolder) {
                currentLevel = existingFolder.content;
            } else {
                const newFolder = {
                    name: part,
                    content: [],
                };

                currentLevel.push(newFolder);
                currentLevel = newFolder.content;

                if (index === pathParts.length - 1) {
                    newFolder.content.push({ name: part });
                }
            }
        });
    });

    return result;
};

const File = ({ name }) => {
    return <div style={{ marginLeft: '20px' }}>{name}</div>;
};

const TreeItem = ({ item }) => {
    if (Array.isArray(item.content)) {
        return <Folder name={item.name} content={item.content} isFolder={item.isFolder} />;
    } else {
        return <File name={item.name} />;
    }
};

const Folder = ({ name, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleFolder = () => {
        setIsOpen(!isOpen);
    };

    const isFolder = Array.isArray(content);
    const isThirdLevel = content.every((item) => !Array.isArray(item.content));

    return (
        <div>
            {isFolder && content.length > 0 && (
                <div onClick={isThirdLevel ? null : toggleFolder}>
                    {isThirdLevel ? '\u00A0\u00A0\u00A0' : isOpen ? '[-]' : '[+]'} {name}
                </div>
            )}
            {isOpen && isFolder && content.length > 0 && (
                <div style={{ marginLeft: '20px' }}>
                    {content.map((item, index) => (
                        <TreeItem key={index} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

const renderTree = (data) => {
    return data.map((item, index) => <TreeItem key={index} item={item} />);
};

const DatabaseInfoPanel = () => {
    const [tablesData, setTablesData] = useState([]);
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
    console.log(tablesData);
    const jsonData = transformToNestedStructure(tablesData);
    console.log(jsonData);

    return (
        <div style={{ maxHeight: '95%', overflow: 'auto' }}>
            <div style={{ maxHeight: '100%', overflow: 'auto' }}>
                {renderTree(jsonData)}
            </div>
        </div>
    );

}

export default DatabaseInfoPanel;
