import React from 'react';
import DatabaseInfoPanel from './DatabaseInfoPanel';
import DatabaseContent from './DatabaseContent';
import Header from "./Header";
import {getCookie} from "../getCookie";

const MainTest = () => {
    if (!getCookie("userName"))
        window.location.href = 'http://localhost:3000/login'

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ flex: '0 0 auto', background: 'lightblue' }}>
                {/* Header Content */}
                <Header />
            </div>
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ flex: 1 , background: 'lightgray', border: '5px solid #FFF', borderRadius: '10px', padding: '10px' }}>
                    <DatabaseInfoPanel />
                </div>
                <div style={{ flex: 3 }}>
                    <DatabaseContent />
                </div>
            </div>
        </div>
    );
}

export default MainTest;
