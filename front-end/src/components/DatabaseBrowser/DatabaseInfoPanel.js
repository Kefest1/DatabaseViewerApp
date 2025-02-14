import React, { useEffect, useState } from 'react';
import './DatabaseInfoPanel.css';
import { getCookie } from "../getCookie";
import Box from "@mui/material/Box";
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { Button, IconButton, Snackbar, SnackbarContent, Stack, Typography, CircularProgress } from "@mui/material";
import { InfoIcon } from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";

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
    console.log(result);
    return result;
};

const DatabaseInfoPanel = ({ handleChange }) => {
    const userName = getCookie("userName");
    const [tablesData, setTablesData] = useState([]);
    const [expandedItems, setExpandedItems] = React.useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true); // Loading state

    async function fetchAvailableDatabases(userName) {
        const token = localStorage.getItem("jwtToken");

        console.log(token);
        const tables = await fetch("http://localhost:8080/api/databaseinfo/getfoldermap/" + userName, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!tables.ok) {
            setMessage("Failed to fetch data");
            setOpenSnackbar(true);
            return [];
        }
        return await tables.json();
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

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

    const fetchAndSetTablesData = () => {
        setLoading(true); // Set loading to true when fetching starts
        fetchAvailableDatabases(userName)
            .then((data) => {
                const organizedData = organizeData(data);
                setTablesData(organizedData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setMessage("Error fetching data");
                setOpenSnackbar(true);
            })
            .finally(() => {
                setLoading(false); // Set loading to false when fetching is done
            });
    };

    useEffect(() => {
        fetchAndSetTablesData();
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
                <Button onClick={() => {
                    fetchAndSetTablesData();
                    setMessage("Updated structure");
                    setOpenSnackbar(true);
                }} style={{ marginLeft: '10px' }}>
                    Refresh
                </Button>
            </div>

            {loading ? ( // Show loading spinner if loading is true
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 770,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : tablesData.length === 0 ? ( // Show "No tables" message if no data
                <h4 style={{
                    fontSize: '1.5rem',
                    color: '#333',
                    marginBottom: '15px',
                    fontFamily: 'Arial, sans-serif',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                    letterSpacing: '0.5px',
                    padding: '10px 0',
                    borderBottom: '2px solid #2A70C6FF',
                    backgroundColor: '#d1d1d1',
                    borderRadius: '4px',
                    textAlign: 'center',
                }}>
                    No tables assigned to you
                </h4>
            ) : ( // Show the actual content if data is available
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
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <SnackbarContent
                    style={{ backgroundColor: '#4365da' }}
                    message={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <InfoIcon style={{ marginRight: 8 }} />
                            {message}
                        </span>
                    }
                    action={[
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            onClick={handleCloseSnackbar}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </Snackbar>
        </Stack>
    );
};

export default DatabaseInfoPanel;
