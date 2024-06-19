import React, { useState } from 'react';

const ResizableWrapper = ({ children }) => {

    return (
        <div
            style={{
                width: '100%',
                minHeight: `48vh`,
                overflow: 'auto',
                bottom: `40px`,
                border: '1px solid black',
            }}
        >
            {children}
        </div>
    );
};

export default ResizableWrapper;