import React, {useEffect, useState} from 'react';
import './DatabaseContent.css';
import './BrowseDatabase/QueryTool';
import QueryTool from "./BrowseDatabase/QueryTool";
import QueryLoggerComponent from "./BrowseDatabase/QueryLoggerComponent";
import Statistics from "./DatabaseStatistics/Statistics";
import {getCookie} from "../../getCookie";
import AdminPanel from "../admin/AdminPanel";
import StructureModifier from "./BrowseDatabase/StructureModifier";


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
            case 6:
                return <StructureModifier/>;
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
                    <div
                        className={`wcPanelTab ${activeButton === 6 ? 'active' : ''}`}
                        onClick={() => handleButtonClick(6)}
                    >
                        Table Creator
                    </div>

                </div>
            </div>
            {renderButtonContent()}
        </div>
    );
};

export default DatabaseContent;