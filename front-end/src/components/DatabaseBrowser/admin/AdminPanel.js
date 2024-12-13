import React, {useEffect, useState} from "react";
import {getCookie} from "../../getCookie";
import Select from "@mui/material/Select";
import {Button, Grid2, List, ListItemButton, ListItemIcon, MenuItem, Paper, Typography} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { ArrowBack, ArrowLeft, ArrowRight, ArrowForward } from "@mui/icons-material";


const AdminPanel = () => {
    const [selectedSubordinate, setSelectedSubordinate] = useState("");
    const [subordinates, setSubordinates] = useState([]);

    const [availableDatabases, setAvailableDatabases] = useState([]);
    const [selectedDatabase, setSelectedDatabase] = useState("");

    const [availableTables, setAvailableTables] = useState([]);
    const [allowedTables, setAllowedTables] = useState([]);

    const [initialAvailableTables, setInitialAvailableTables] = useState([]);
    const [initialAllowedTables, setInitialAllowedTables] = useState([]);

    const [checked, setChecked] = React.useState([]);

    const leftChecked = intersection(checked, availableTables);
    const rightChecked = intersection(checked, allowedTables);
    const adminName = getCookie("userName");

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    function not(a, b) {
        return a.filter((value) => !b.includes(value));
    }

    function intersection(a, b) {
        return a.filter((value) => b.includes(value));
    }

    const getSubordinates = async () => {
        const response = await fetch(
            `http://localhost:8080/api/userinfo/getsubordinates/${adminName}`
        );
        const data = await response.json();
        console.log(data);
        setSubordinates(data);
    };

    useEffect(() => {
        getSubordinates();
    }, []);

    const getDatabase = async () => {
        const response = await fetch(
            `http://localhost:8080/api/tableinfo/getAvailableDatabasesObject/${adminName}`
        );
        const data = await response.json();
        console.log(data);
        setAvailableDatabases(data);
    };

    useEffect(() => {
        getDatabase();
    }, []);

    const customList = (tablesInfo) => ( // TODO Customize
        <Paper sx={{ width: 300, height: 360, overflow: 'auto' }}>
            <List dense component="div" role="list">
                {tablesInfo.map((val) => {
                    const labelID = `list-${val}`;

                    return (
                        <ListItemButton
                            key={val}
                            onClick={handleToggle(val)}
                            role="listitem"
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.includes(val)}
                                    inputProps={{
                                        'aria-labelledby': labelID,
                                    }}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText id={labelID} primary={`Table: ${val}`} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Paper>
    );

    const handleSelect = async () => {
        const response = await fetch(
            `http://localhost:8080/api/tableinfo/getAvailableTablesAndDatabases/${adminName}/${selectedSubordinate}/${selectedDatabase}`
        );
        const availableTables = await response.json();
        console.log(availableTables);

        const response2 = await fetch(
            `http://localhost:8080/api/tableinfo/getAllowedTablesAndDatabases/${adminName}/${selectedSubordinate}/${selectedDatabase}`
        );

        const allowedTables = await response2.json();
        console.log(allowedTables);

        setAvailableTables(availableTables);
        setAllowedTables(allowedTables);
        setInitialAvailableTables(availableTables);
        setInitialAllowedTables(allowedTables);
    };

    const handleSelectDatabase = async (event) => {
        console.log(event.target.value);
        setSelectedDatabase(event.target.value);
    }

    const handleSelectSubordinate = async (event) => {
        console.log(event.target.value)
        setSelectedSubordinate(event.target.value)
    }

    useEffect(() => {
        if (selectedDatabase !== "" && selectedSubordinate !== "") {
            handleSelect().then(r => {});
        }
    }, [selectedSubordinate, selectedDatabase]);

    const handleAllRight = () => {
        setAllowedTables(allowedTables.concat(availableTables));
        setAvailableTables([]);
    };

    const handleCheckedRight = () => {
        console.log(leftChecked);
        setAllowedTables(allowedTables.concat(leftChecked));
        setAvailableTables(not(availableTables, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        console.log(rightChecked);
        setAvailableTables(availableTables.concat(rightChecked));
        setAllowedTables(not(allowedTables, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setAvailableTables(availableTables.concat(allowedTables));
        setAllowedTables([]);
    };

    function DEBUG() {
        let toRemoveTables = availableTables.filter(item => !initialAllowedTables.includes(item));
        let toInsertTables= initialAllowedTables.filter(item => !availableTables.includes(item));

        toRemoveTables = availableTables.filter(item => !toRemoveTables.includes(item))
        toInsertTables = allowedTables.filter(item => !toInsertTables.includes(item));

        fetch(`http://localhost:8080/api/ownershipdetails/delete/${selectedSubordinate}/${adminName}/${selectedDatabase}?tableNames=${toRemoveTables.join('&tableNames=')} `, {
            method: 'DELETE'
        })
            .then(response => response.text())
            .then(data => console.log(data));

        fetch(`http://localhost:8080/api/ownershipdetails/add/${selectedSubordinate}/${adminName}/${selectedDatabase}?tableNames=${toInsertTables.join('&tableNames=')} `, {
            method: 'POST'
        })
            .then(response => response.text())
            .then(data => console.log(data));
    }

    return (
        <Paper elevation={3} style={{ padding: '20px', margin: '20px', borderRadius: '8px' }}>
            <div style={{ marginLeft: '20px' }}>
                <Typography variant="h6" gutterBottom>Select Options</Typography>

                <Select
                    labelId="select-subordinate-label"
                    id="select-subordinate"
                    label="Select Subordinate"
                    variant="outlined"
                    value={selectedSubordinate}
                    onChange={handleSelectSubordinate}
                    fullWidth
                    style={{ marginBottom: '8px', width: '300px', height: '50px'}}
                >
                    <MenuItem value=""><em>Select a subordinate</em></MenuItem>
                    {subordinates.map((subordinate) => (
                        <MenuItem key={subordinate.id} value={subordinate.username}>
                            {subordinate.username}
                        </MenuItem>
                    ))}
                </Select>
                <br/>
                <Select
                    labelId="select-database-label"
                    id="select-database"
                    label="Select Table"
                    variant="outlined"
                    value={selectedDatabase}
                    onChange={handleSelectDatabase}
                    fullWidth
                    style={{ marginBottom: '8px', width: '300px', height: '50px'}}
                >
                    <MenuItem value=""><em>Select a database</em></MenuItem>
                    {availableDatabases.map((database) => (
                        <MenuItem key={database.id} value={database.databaseName}>
                            {database.databaseName}
                        </MenuItem>
                    ))}
                </Select>

                {selectedDatabase && selectedSubordinate && (
                    <div>
                        <Typography variant="body1">Selected Subordinate: {selectedSubordinate}</Typography>
                        <Typography variant="body1">Selected Database: {selectedDatabase}</Typography>
                        <Button variant="contained" color="primary" onClick={DEBUG} style={{ margin: '10px 0' }}>
                            Commit Changes
                        </Button>
                        <Grid2 container spacing={2} justifyContent="center" alignItems="center">
                            <Grid2 item xs={5}>
                                <Typography variant="subtitle2">Tables Unassigned to {selectedSubordinate}:</Typography>
                                {customList(availableTables)}
                            </Grid2>
                            <Grid2 item xs={2}>
                                <Grid2 container direction="column" alignItems="center">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleAllRight}
                                        disabled={availableTables.length === 0}
                                        aria-label="move all right"
                                        style={{ margin: '5px 0' }}
                                    >
                                        <ArrowForward />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleCheckedRight}
                                        disabled={leftChecked.length === 0}
                                        aria-label="move selected right"
                                        style={{ margin: '5px 0' }}
                                    >
                                        <ArrowRight />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleCheckedLeft}
                                        disabled={rightChecked.length === 0}
                                        aria-label="move selected left"
                                        style={{ margin: '5px 0' }}
                                    >
                                        <ArrowLeft />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleAllLeft}
                                        disabled={allowedTables.length === 0}
                                        aria-label="move all left"
                                        style={{ margin: '5px 0' }}
                                    >
                                        <ArrowBack />
                                    </Button>
                                </Grid2>
                            </Grid2>
                            <Grid2 item xs={5}>
                                <Typography variant="subtitle2">Tables Assigned to {selectedSubordinate}:</Typography>
                                {customList(allowedTables)}
                            </Grid2>
                        </Grid2>
                    </div>
                )}
            </div>
        </Paper>
    );
};

export default AdminPanel;
