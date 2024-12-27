import React, {useEffect, useState} from 'react';
import './DatabaseContent.css';
import './BrowseDatabase/QueryTool';
import QueryTool from "./BrowseDatabase/QueryTool";
import QueryLoggerComponent from "./BrowseDatabase/QueryLoggerComponent";
import Statistics from "./DatabaseStatistics/Statistics";
import {getCookie} from "../../getCookie";
import AdminPanel from "../admin/AdminPanel";
import StructureModifier from "./BrowseDatabase/StructureModifier";
import DatabaseScheme from "./BrowseDatabase/DatabaseScheme";
import BrowseMultipleTables from "./BrowseDatabase/BrowseMultipleTables";
import ConnectionsCreator from "./BrowseDatabase/ConnectionsCreator";

const Component = ( {name} ) => {
    return <div style={{ marginLeft: '20px' }}>{name}</div>;
}

const DatabaseContent = ({selectedTable}) => {
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
                return <QueryTool selectedDbTable={locSelectedTable} />;
            case 2:
                return <BrowseMultipleTables />;
            case 3:
                return <Statistics/>;
            case 4:
                if (isAdmin)
                    return <AdminPanel name={"Admin panel"}/>;
                else
                    return <Component name={"TODO"}/>;
            case 5:
                return <QueryLoggerComponent/>;
            case 6:
                return <StructureModifier/>;
            case 7:
                return <DatabaseScheme/>;
            case 8:
                return <ConnectionsCreator/>;
            default:
                return null;
        }
    }

    return (
        <div>
            <div className="header">
                <div className="button-container">
                    <div
                        className={`wcPanelTab ${activeButton === 1 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(1)}
                    >
                        Single table CRUD

                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 2 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(2)}
                    >
                        Browse multiple tables
                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 3 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(3)}
                    >
                        Statistics
                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 4 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(4)}
                    >
                        Admin Panel

                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 5 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(5)}
                    >
                        Logger
                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 6 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(6)}
                    >
                        Structure modifier
                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 7 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(7)}
                    >
                        Browse database scheme
                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 8 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(8)}
                    >
                        Connections Creator
                    </div>

                </div>
            </div>
            {renderButtonContent()}
        </div>
    );
};

export default DatabaseContent;