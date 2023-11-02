import React from 'react';
import DatabaseInfoPanel from './DatabaseInfoPanel';
import DatabaseContent from './DatabaseContent';

const MainComponent = () => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
                <DatabaseInfoPanel />
            </div>
            <div style={{ flex: 1 }}>
                <DatabaseContent />
            </div>
        </div>
    );
}

export default MainComponent;
