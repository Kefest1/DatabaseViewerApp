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
import {IconButton, Snackbar, SnackbarContent} from "@mui/material";
import {InfoIcon} from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";

const DatabaseContent = () => {
    const isAdmin = getCookie("isAdmin");

    const [activeButton, setActiveButton] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("");

        const [dataQueryTool, setDataQueryTool] = useState({"update" : [], "insert" : []});

        const handleButtonClick = (buttonIndex) => {
            if (activeButton === 2) {
                console.log(dataQueryTool);
                console.log(dataQueryTool.update);
                console.log(dataQueryTool.update.length);
                if (dataQueryTool.update.length > 0 || dataQueryTool.insert.length > 0) {
                    if (window.confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
                        setMessage("Changes were not saved!");
                        setOpenSnackbar(true);
                    } else {
                        return;
                    }
                }
            console.log(dataQueryTool);
        }
        setActiveButton(buttonIndex);
    };

    const renderButtonContent = () => {
        switch (activeButton) {
            case 1:
                return <WelcomePage />;
            case 2:
                return <QueryTool setData={setDataQueryTool}/>;
            case 3:
                return <BrowseMultipleTables />;
            case 4:
                return <Statistics />;
            case 5:
                return isAdmin ? <AdminPanel name={"Admin panel"} /> : <div>TODO</div>;
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
