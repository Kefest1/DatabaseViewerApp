// Sidebar.js
import React from 'react';
import Folder from './Folder';

const Sidebar = () => {
    const folderData = [
        { name: 'Folder A', subfolders: ['Subfolder 1', 'Subfolder 2'] },
        { name: 'Folder B', subfolders: ['Subfolder 3'] },
    ];

    return (
        <div className="sidebar">
            {folderData.map((folder, index) => (
                <Folder key={index} name={folder.name} subfolders={folder.subfolders} />
            ))}
        </div>
    );
};

export default Sidebar;