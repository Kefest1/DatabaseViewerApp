import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DatabaseContent.css';
import './BrowseDatabase/QueryTool';
import QueryTool from "./BrowseDatabase/QueryTool";
import QueryLoggerComponent from "./BrowseDatabase/QueryLoggerComponent";
import Statistics from "./DatabaseStatistics/Statistics";
import { getCookie } from "../../getCookie";
import WelcomePage from "../../WelcomePages/WelcomePage";
import AdminPanel from "../admin/AdminPanel";
import StructureModifier from "./BrowseDatabase/StructureModifier";
import DatabaseScheme from "./BrowseDatabase/DatabaseScheme";
import BrowseMultipleTables from "./BrowseDatabase/BrowseMultipleTables";
import ConnectionsCreator from "./BrowseDatabase/ConnectionsCreator";
import {
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Snackbar,
    SnackbarContent
} from "@mui/material";
import {InfoIcon} from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import UserAdminPanel from "../admin/UserAdminPanel";



const DatabaseContent = () => {
    const isAdmin = getCookie("isAdmin") === "true";

    const [activeButton, setActiveButton] = useState(1);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("");
    const [messageDialog, setMessageDialog] = useState("");

    const [dataQueryTool, setDataQueryTool] = useState({"update" : [], "insert" : []});
    const [occupiedTableInfo, setOccupiedTableInfo] = useState({
        "tableName": "",
        "databaseName": "",
        "userName": ""
    });
    const [canSwitchFromAdmin, setCanSwitchFromAdmin] = useState(true);

    const handleButtonClick = (buttonIndex) => {
        if (activeButton === 2) {
            if (dataQueryTool.update.length > 0 || dataQueryTool.insert.length > 0) {
                setPendingButtonIndex(buttonIndex);
                setOpenDialog(true);
                setMessageDialog("You have unsaved changes. Are you sure you want to leave this page?");
                return;
            }
        }
        if (activeButton === 5) {
            if (canSwitchFromAdmin === false) {
                setMessageDialog("You have unsaved changes. Are you sure you want to leave this page?");
                setPendingButtonIndex(buttonIndex);
                setOpenDialog(true);
                setCanSwitchFromAdmin(true);
                return;
            }
        }
        setActiveButton(buttonIndex);
    };

    const [openDialog, setOpenDialog] = useState(false);
    const [pendingButtonIndex, setPendingButtonIndex] = useState(null);

    const renderButtonContent = () => {
        switch (activeButton) {
            case 1:
                return <WelcomePage />;
            case 2:
                return <QueryTool setData={setDataQueryTool} setOccupiedTableInfo={setOccupiedTableInfo}/>;
            case 3:
                return <BrowseMultipleTables />;
            case 4:
                return <Statistics />;
            case 5:
                return isAdmin ? <AdminPanel name={"Admin panel"} setOccupiedAdmin={setCanSwitchFromAdmin} /> : <UserAdminPanel />;
            case 6:
                return <QueryLoggerComponent />;
            case 7:
                return <StructureModifier />;
            case 8:
                return <DatabaseScheme />;
            case 9:
                return <ConnectionsCreator />;
            default:
                return null;
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const confirmLeave = () => {
        setOpenDialog(false);
        setMessage("Changes were not saved!");
        setOpenSnackbar(true);
        setActiveButton(pendingButtonIndex);
    };


    return (
        <div>
            <div className="header">
                <div className="button-container">
                    <div
                        className={`wcPanelTab ${activeButton === 1 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(1)}
                    >
                        Welcome!
                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 2 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(2)}
                    >
                        Single table CRUD
                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 3 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(3)}
                    >
                        Browse multiple tables
                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 4 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(4)}
                    >
                        Statistics
                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 5 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(5)}
                    >
                        Admin Panel
                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 6 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(6)}
                    >
                        Logger
                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 7 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(7)}
                    >
                        Structure modifier
                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 8 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(8)}
                    >
                        Browse database scheme
                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 9 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(9)}
                    >
                        Connections Creator
                    </div>
                </div>
            </div>
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeButton}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderButtonContent()}
                </motion.div>
            </AnimatePresence>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>Unsaved Changes</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You have unsaved changes. Are you sure you want to leave this page?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmLeave} color="secondary">
                        Leave
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <SnackbarContent
                    style={{ backgroundColor: '#766ff4' }}
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
};

export default DatabaseContent;
