import React, {useEffect, useState} from "react";
import {getCookie} from "../../getCookie";
import Select from "@mui/material/Select";
import {
    Button, FormControl,
    Grid2, IconButton,
    InputLabel,
    List,
    ListItemButton,
    ListItemIcon,
    MenuItem,
    Paper, Snackbar, SnackbarContent,
    Typography
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { ArrowBack, ArrowLeft, ArrowRight, ArrowForward } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import DoneOutline from '@mui/icons-material/DoneOutline';

const AdminPanel = ({setOccupiedAdmin}) => {
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


    const [message, setMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

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
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(
            `http://localhost:8080/api/userinfo/getsubordinates/${adminName}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        const data = await response.json();
        setSubordinates(data);
    };

    useEffect(() => {
        getSubordinates();
    }, []);

    const getDatabase = async () => {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(
            `http://localhost:8080/api/tableinfo/getAvailableDatabasesObject/${adminName}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        const data = await response.json();
        setAvailableDatabases(data);
    };

    useEffect(() => {
        getDatabase();
    }, []);

    const customList = (tablesInfo) => (
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
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(
            `http://localhost:8080/api/tableinfo/getAvailableTablesAndDatabases/${adminName}/${selectedSubordinate}/${selectedDatabase}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        const availableTables = await response.json();

        const response2 = await fetch(
            `http://localhost:8080/api/tableinfo/getAllowedTablesAndDatabases/${adminName}/${selectedSubordinate}/${selectedDatabase}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const allowedTables = await response2.json();

        setAvailableTables(availableTables);
        setAllowedTables(allowedTables);
        setInitialAvailableTables(availableTables);
        setInitialAllowedTables(allowedTables);
    };

    const handleSelectDatabase = async (event) => {
        setSelectedDatabase(event.target.value);
    }

    const handleSelectSubordinate = async (event) => {
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

        let toRemoveTables = availableTables.filter(item => !initialAllowedTables.includes(item));
        let toInsertTables= initialAllowedTables.filter(item => !availableTables.includes(item));

        toRemoveTables = availableTables.filter(item => !toRemoveTables.includes(item))
        toInsertTables = allowedTables.filter(item => !toInsertTables.includes(item));
        setOccupiedAdmin(toRemoveTables.length > 0 || toInsertTables.length > 0);
    };

    const handleCheckedRight = () => {
        setAllowedTables(allowedTables.concat(leftChecked));
        setAvailableTables(not(availableTables, leftChecked));
        setChecked(not(checked, leftChecked));

        let toRemoveTables = availableTables.filter(item => !initialAllowedTables.includes(item));
        let toInsertTables= initialAllowedTables.filter(item => !availableTables.includes(item));

        toRemoveTables = availableTables.filter(item => !toRemoveTables.includes(item))
        toInsertTables = allowedTables.filter(item => !toInsertTables.includes(item));
        setOccupiedAdmin(toRemoveTables.length > 0 || toInsertTables.length > 0);
    };

    const handleCheckedLeft = () => {
        setAvailableTables(availableTables.concat(rightChecked));
        setAllowedTables(not(allowedTables, rightChecked));
        setChecked(not(checked, rightChecked));

        let toRemoveTables = availableTables.filter(item => !initialAllowedTables.includes(item));
        let toInsertTables= initialAllowedTables.filter(item => !availableTables.includes(item));

        toRemoveTables = availableTables.filter(item => !toRemoveTables.includes(item))
        toInsertTables = allowedTables.filter(item => !toInsertTables.includes(item));
        setOccupiedAdmin(toRemoveTables.length > 0 || toInsertTables.length > 0);
    };

    const handleAllLeft = () => {
        setAvailableTables(availableTables.concat(allowedTables));
        setAllowedTables([]);


        let toRemoveTables = availableTables.filter(item => !initialAllowedTables.includes(item));
        let toInsertTables= initialAllowedTables.filter(item => !availableTables.includes(item));

        toRemoveTables = availableTables.filter(item => !toRemoveTables.includes(item))
        toInsertTables = allowedTables.filter(item => !toInsertTables.includes(item));
        setOccupiedAdmin(toRemoveTables.length > 0 || toInsertTables.length > 0);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    function DEBUG() {
        let toRemoveTables = availableTables.filter(item => !initialAllowedTables.includes(item));
        let toInsertTables= initialAllowedTables.filter(item => !availableTables.includes(item));

        toRemoveTables = availableTables.filter(item => !toRemoveTables.includes(item));
        toInsertTables = allowedTables.filter(item => !toInsertTables.includes(item));
        setOccupiedAdmin(true);

        if (toRemoveTables.length === 0 && toInsertTables.length === 0) {
            setMessage('No changes!');
            setOpenSnackbar(true);
            return;
        }

        fetch(`http://localhost:8080/api/ownershipdetails/delete/${selectedSubordinate}/${adminName}/${selectedDatabase}?tableNames=${toRemoveTables.join('&tableNames=')} `, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
            }
        })
            .then(response => response.text())
            .then(data => console.log(data));

        fetch(`http://localhost:8080/api/ownershipdetails/add/${selectedSubordinate}/${adminName}/${selectedDatabase}?tableNames=${toInsertTables.join('&tableNames=')} `, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
            }
        })
            .then(response => response.text())
            .then(data => console.log(data));

        setMessage('Database ownership has been updated!');
        setOpenSnackbar(true);
    }

    return (
        <Paper sx={{ width: 'calc(80vw)', height: 'calc(86vh)', overflow: 'auto' }} elevation={3} style={{ padding: '10px', margin: '10px', borderRadius: '8px' }}>

        <div style={{ marginLeft: '20px' }}>
                <Typography variant="h6" gutterBottom>Select subordinate and tables</Typography>
                <FormControl variant="outlined">
                    <InputLabel id="select-subordinate-label">Select subordinate</InputLabel>
                    <Select
                        labelId="select-subordinate-label"
                        id="select-subordinate"
                        label="Select Subordinate"
                        variant="outlined"
                        value={selectedSubordinate}
                        onChange={handleSelectSubordinate}
                        fullWidth
                        style={{ marginBottom: '16px',marginRight: '10px', width: '300px', height: '50px' }}
                    >
                        <MenuItem value=""><em>Select a subordinate</em></MenuItem>
                        {subordinates.map((subordinate) => (
                            <MenuItem key={subordinate.id} value={subordinate.username}>
                                {subordinate.username}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
               <FormControl variant="outlined">
                   <InputLabel id="select-database-label">Select a Database</InputLabel>
                    <Select
                        labelId="select-database-label"
                        id="select-database"
                        label="Select Table"
                        variant="outlined"
                        value={selectedDatabase}
                        onChange={handleSelectDatabase}
                        fullWidth
                        style={{ marginBottom: '16px', width: '300px', height: '50px' }}
                    >
                        <MenuItem value=""><em>Select a database</em></MenuItem>
                        {availableDatabases.map((database) => (
                            <MenuItem key={database.id} value={database.databaseName}>
                                {database.databaseName}
                            </MenuItem>
                        ))}
                    </Select>
               </FormControl>

                {selectedDatabase && selectedSubordinate && (
                    <div>
                        <Typography variant="body1" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                            Selected Subordinate: <span style={{ color: '#3f51b5' }}>{selectedSubordinate}</span>
                        </Typography>
                        <Typography variant="body1" style={{ fontWeight: 'bold', marginBottom: '16px' }}>
                            Selected Database: <span style={{ color: '#3f51b5' }}>{selectedDatabase}</span>
                        </Typography>
                        <Button variant="contained" color="primary" onClick={DEBUG} style={{ margin: '10px 0' }}>
                            Commit Changes
                        </Button>
                        <Grid2 container spacing={2} justifyContent="center" alignItems="center">
                            <Grid2 item xs={5}>
                                <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                    Tables Unassigned to {selectedSubordinate}:
                                </Typography>
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
                                <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                    Tables Assigned to {selectedSubordinate}:
                                </Typography>
                                {customList(allowedTables)}
                            </Grid2>
                        </Grid2>
                    </div>
                )}
            </div>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <SnackbarContent
                    style={{ backgroundColor: '#117311' }}
                    message={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <DoneOutline style={{ marginRight: 8 }} />
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
        </Paper>
    );
};

export default AdminPanel;
