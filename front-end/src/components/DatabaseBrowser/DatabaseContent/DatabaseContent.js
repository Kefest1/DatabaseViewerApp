import React, { useState } from 'react';
import './DatabaseContent.css';
import './BrowseDatabase/QueryTool';
import QueryTool from "./BrowseDatabase/QueryTool";
import QueryLoggerComponent from "./BrowseDatabase/QueryLoggerComponent";
import Statistics from "./DatabaseStatistics/Statistics";
import {getCookie} from "../../getCookie";
import AdminPanel from "../admin/AdminPanel";


const Component = ( {name} ) => {
    return <div style={{ marginLeft: '20px' }}>{name}</div>;
}


const DatabaseContent = ({selectedTable}) => {
    const isAdmin = getCookie("isAdmin");

    const [activeButton, setActiveButton] = useState(null);

    const handleButtonClick = (buttonIndex) => {
        setActiveButton(buttonIndex);
    };

    const renderButtonContent = () => {
        switch (activeButton) {
            case 1:
                return <QueryTool />;
            case 2:
                return <Statistics/>;
            case 3:
                if (isAdmin)
                    return <AdminPanel name={"Admin panel"}/>;
                else
                    return <Component name={"TODO"}/>;
            case 4:
                if (isAdmin)
                    return <QueryLoggerComponent/>;
                else return null;
            case 5:
                return <QueryLoggerComponent/>;
            default:
                return null;
        }
    }
    return (
        <div>
            <h1>{selectedTable}</h1>
        </div>
    );
/*
    return (
        <div>
            <div className="header">
                <div className="button-container">
                    <div
                        className={`wcPanelTab ${activeButton === 1 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(1)}
                    >
                        Browse content

                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 2 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(2)}
                    >
                        Statistics
                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 3 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(3)}
                    >
                        Admin Panel
                    </div>
                    <div
                        className={`wcPanelTab ${activeButton === 4 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(4)}
                    >
                        Logger
                    </div>

                </div>
            </div>
            {renderButtonContent()}
        </div>
    );*/
};

export default DatabaseContent;