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

const DatabaseContent = ({ selectedTable }) => {
    const isAdmin = getCookie("isAdmin");

    const [activeButton, setActiveButton] = useState(null);
    const [locSelectedTable, setLocSelectedTable] = useState("");

    const handleButtonClick = (buttonIndex) => {
        if (buttonIndex === 1) {
            setLocSelectedTable("");
        }
        setActiveButton(buttonIndex);
    };

    const handleChangeInSelectedTable = (buttonIndex) => {
        setLocSelectedTable(selectedTable);
        setActiveButton(buttonIndex);
    };

    useEffect(() => {
        handleChangeInSelectedTable(1);
    }, [selectedTable]);

    const renderButtonContent = () => {
        switch (activeButton) {
            case 1:
                return <WelcomePage />;
            case 2:
                return <QueryTool selectedDbTable={locSelectedTable} />;
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
                    transition={{ duration: 0.4 }}
                >
                    {renderButtonContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default DatabaseContent;
