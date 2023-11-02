import React from 'react';
import DatabaseInfoPanel from './DatabaseInfoPanel';
import DatabaseContent from './DatabaseContent';
import RegisterPage from "../WelcomePages/RegisterPage";
import LoginPage from "../WelcomePages/LoginPage";

const MainTest = () => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
                <DatabaseInfoPanel />
            </div>
            <div style={{ flex: 2 }}>
                <DatabaseContent />
            </div>
        </div>
    );
}

export default MainTest;
