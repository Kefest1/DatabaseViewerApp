import React, { useState } from 'react';
const Resizable = ({ children, initialHeight }) => {
    const [height, setHeight] = useState(initialHeight);
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseDown = (event) => {
        setIsResizing(true);
    };

    const handleMouseMove = (event) => {
        if (isResizing) {
            setHeight(window.innerHeight - event.clientY);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    return (
        <div
            style={{
                height: `${height}px`,
                width: '100%',
                overflow: 'auto',
                border: '1px solid black',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {children}
        </div>
    );
};

export default Resizable;