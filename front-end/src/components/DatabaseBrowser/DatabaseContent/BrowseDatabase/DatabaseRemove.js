import {getCookie} from ".././.././../getCookie";
import React, {useEffect, useState} from "react";
import {FormControl, IconButton, InputLabel, MenuItem, Snackbar, SnackbarContent} from "@mui/material";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import {InfoIcon} from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";


async function fetchAvailableDatabases() {
    const userName = getCookie("userName");
    const tables = await fetch(
        "http://localhost:8080/api/tableinfo/getAvailableDatabases/" + userName
    );
    return await tables.json();
}




function DatabaseRemove() {
    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [availableDatabases, setAvailableDatabases] = useState([]);

    useEffect(() => {
        const loadDatabases = async () => {
            const availableDBs = await fetchAvailableDatabases();
            setAvailableDatabases(availableDBs);
        };

        loadDatabases();
    }, []);


    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("");

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    async function deleteDatabase(selectedDatabase) {
        const userName = getCookie("userName");

        try {
            const response = await fetch(`http://localhost:8080/api/databaseinfo/delete/${selectedDatabase}/${userName}`, {
                method: "DELETE",
            });

            if (response.ok) {
                const message = await response.text();
                setMessage(message);
                setOpenSnackbar(true);
            } else {
                setMessage("Failed to delete the database:");
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error("Error occurred while deleting the database:", error);
        }
    }

    return (
        <div>
            <FormControl variant="outlined">
                <InputLabel id="demo-simple-select-table">Select a Database</InputLabel>
                <Select
                    labelId="demo-simple-select-table"
                    id="demo-simple-table"
                    value={selectedDatabase}
                    label="Select Table"
                    onChange={(event) => setSelectedDatabase(event.target.value)}
                    variant={"outlined"}
                    style={{width: "200px"}}
                >
                    {availableDatabases.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedDatabase !== "" && (
                <div>
                    <Button
                        variant="contained"
                        onClick={() => deleteDatabase(selectedDatabase)}
                    >
                        Delete a database
                    </Button>
                </div>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <SnackbarContent
                    style={{ backgroundColor: '#3d69cc' }}
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
        </div>

    );
}

export default DatabaseRemove;
