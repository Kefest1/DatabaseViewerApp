import React, { useEffect, useState } from 'react';
import './DatabaseInfoPanel.css';
import { getCookie } from "../getCookie";
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Box from "@mui/material/Box";
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {Button, Stack} from "@mui/material";

async function fetchAvailableDatabases(userName) {
    const tables = await fetch("http://localhost:8080/api/databaseinfo/getfoldermap/" + userName);
    return [
        "northwind,categories",
        "northwind,customers",
        "northwind,employees",
        "northwind,orderdetails",
        "northwind,orders",
        "northwind,products",
        "northwind,shippers",
        "northwind,suppliers",
        "adventureworks,customers",
        "adventureworks,orders",
        "adventureworks,products"
    ];
}

function organizeData(data) {
    let result = data.map(item => {
        const [database, table] = item.split(',');
        return `${database},${table}`;
    });
    result = [...new Set(result)];

    const res = {};

    result.forEach(item => {
        const [db, table] = item.split(',');

        if (!res[db]) {
            res[db] = {
                id: db,
                label: db,
                children: []
            };
        }

        res[db].children.push({
            id: `${db} ${table}`,
            label: table
        });
    });

    return Object.values(res);
}


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

                <Box sx={{minHeight: 352, minWidth: 250}}>
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
