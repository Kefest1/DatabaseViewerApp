import React, {useEffect, useRef, useState} from 'react';
import './DatabaseInfoPanel.css';
import { getCookie } from "../getCookie";
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Box from "@mui/material/Box";
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {Button, Stack} from "@mui/material";

async function fetchAvailableDatabases(userName) {
    const tables = await fetch("http://localhost:8080/api/databaseinfo/getfoldermap/" + userName);
    return await tables.json();
}

const organizeData = (data) => {
    const result = [];
    let idCounter = 1;

    data.forEach(item => {
        const [database, table, column] = item.split(',');

        let dbEntry = result.find(db => db.label === database);
        if (!dbEntry) {
            dbEntry = { id: String(idCounter++), label: database, children: [] };
            result.push(dbEntry);
        }
        let tableEntry = dbEntry.children.find(tbl => tbl.label === table);
        if (!tableEntry) {
            tableEntry = { id: String(idCounter++), label: table, children: [] };
            dbEntry.children.push(tableEntry);
        }

        tableEntry.children.push({ id: String(idCounter++), label: column });
    });

    return result;
};


const DatabaseInfoPanel = ({handleChange}) => {
    const userName = getCookie("userName");
    const [tablesData, setTablesData] = useState([]);

    const [expandedItems, setExpandedItems] = React.useState([]);

    const handleExpandedItemsChange = (event, itemIds) => {
        setExpandedItems(itemIds);
    };

    const handleExpandClick = () => {
        setExpandedItems((oldExpanded) =>
            oldExpanded.length === 0 ? getAllItemsWithChildrenItemIds() : [],
        );
    };

    const getAllItemsWithChildrenItemIds = () => {
        const itemIds = [];
        const registerItemId = (item) => {
            if (item.children?.length) {
                itemIds.push(item.id);
                item.children.forEach(registerItemId);
            }
        };

        tablesData.forEach(registerItemId);

        return itemIds;
    };

    useEffect(() => {
        fetchAvailableDatabases(userName)
            .then((data) => {
                const organizedData = organizeData(data);
                setTablesData(organizedData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [userName]);


    const handleNodeClick = (event, nodeId) => {

        const parentDatabase = tablesData.find((db) =>
            db.children.some((child) => child.id === nodeId)
        );

        if (parentDatabase) {
            const clickedTable = parentDatabase.children.find(
                (child) => child.id === nodeId
            );
            handleChange(`${clickedTable.label},${parentDatabase.label}`);
        }
    };

    return (
        <Stack spacing={2}>
            <div>
                <Button onClick={handleExpandClick}>
                    {expandedItems.length === 0 ? 'Expand all' : 'Collapse all'}
                </Button>
            </div>

            <Box
                sx={{
                    height: 770,
                    minWidth: 250,
                    overflowY: "scroll",
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#888',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#555',
                    },
                }}
            >
                <RichTreeView
                    items={tablesData}
                    expandedItems={expandedItems}
                    onExpandedItemsChange={handleExpandedItemsChange}
                    onItemClick={handleNodeClick}
                />
            </Box>

        </Stack>

    );
};

export default DatabaseInfoPanel;
