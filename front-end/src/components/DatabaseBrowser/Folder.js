import React, { useState } from 'react';

const Folder = ({ name, subfolders }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleFolder = () => {
        setExpanded(!expanded);
    };

    return (
        <div>
            <div onClick={toggleFolder}>
                {expanded ? '📂' : '📁'} {name}
            </div>
            {expanded && (
                <ul>
                    {subfolders.map((subfolder, index) => (
                        <li key={index}>{subfolder}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Folder;