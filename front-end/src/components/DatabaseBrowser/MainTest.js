import React, {useEffect, useState} from 'react';
import DatabaseInfoPanel from './DatabaseInfoPanel';
import DatabaseContent from './DatabaseContent/DatabaseContent';
import Header from "./Header";
import {getCookie} from "../getCookie";

const MainTest = () => {
    const [selectedTable, setSelectedTable] = useState("");

    useEffect(() => {
        document.title = "Database viewer app";
    }, []);

    if (!getCookie("userName")) {
        window.location.href = 'http://localhost:3000/login';
        return;
    }

    function handleSelectedTableChange(newTable) {
        setSelectedTable(newTable);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ flex: '0 0 auto', background: 'lightblue' }}>
                <Header />
            </div>
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ flex: 1 , background: 'lightgray', border: '5px solid #FFF', borderRadius: '10px', padding: '10px' }}>
                    <DatabaseInfoPanel handleChange={handleSelectedTableChange} />
                </div>
                <div style={{ flex: 3 }}>
                    <DatabaseContent selectedTable={selectedTable} setSelectedTable={handleSelectedTableChange} />
                </div>
            </div>
        </div>
    );
}

export default MainTest;
