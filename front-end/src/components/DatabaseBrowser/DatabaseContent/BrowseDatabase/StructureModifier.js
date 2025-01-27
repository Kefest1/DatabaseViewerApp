import React, {useState} from "react";
import DatabaseCreator from "./DatabaseCreator";
import TableCreator from "./TableCreator";
import DatabaseModifier from "./DatabaseModifier";
import TableModifier from "./TableModifier";
import DatabaseRemove from "./DatabaseRemove";
import {IconButton, Paper, Snackbar, SnackbarContent} from "@mui/material";
import {InfoIcon} from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";

function StructureModifier() {

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("");

    function handleCloseSnackbar() {
        setOpenSnackbar(false);
    }

    return (
        <Paper sx={{ width: 'calc(80vw)', height: 'calc(86vh)', overflow: 'auto' }} elevation={3} style={{ padding: '10px', margin: '10px', borderRadius: '8px' }}>
            <div>
                <h5 style={{
                    fontSize: '1.5rem',
                    color: '#333',
                    marginBottom: '15px',
                    fontFamily: 'Arial, sans-serif',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                    letterSpacing: '0.5px',
                    padding: '10px 0',
                    borderBottom: '2px solid #2A70C6FF',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '4px',
                    textAlign: 'center',
                }}>
                    Structure modifier
                </h5>

                <DatabaseCreator/>
                <br/>

                <TableCreator setMessage={setMessage} setOpenSnackbar={setOpenSnackbar} />
                <br/>

                <DatabaseModifier setMessage={setMessage} setOpenSnackbar={setOpenSnackbar} />
                <br/>

                <TableModifier setMessage={setMessage} setOpenSnackbar={setOpenSnackbar} />
                <br/>

                <DatabaseRemove setMessage={setMessage} setOpenSnackbar={setOpenSnackbar} />

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
            </div>
        </Paper>
    )
}

export default StructureModifier;
