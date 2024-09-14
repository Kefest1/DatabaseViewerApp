import React, {useEffect, useState} from "react";
import {getCookie} from "../../getCookie";


const AdminPanel = ({ name }) => {
    const [selectedSubordinate, setSelectedSubordinate] = useState(null);
    const [subordinates, setSubordinates] = useState([]);
    const adminName = getCookie("userName");

    const getSubordinates = async () => {
        console.log(adminName);
        const response = await fetch(
            `http://localhost:8080/api/userinfo/getsubordinates/${adminName}`
        );
        const data = await response.json();
        setSubordinates(data);
    };

    useEffect(() => {
        getSubordinates();
    }, []);

    const handleSelect = async (event) => {
        setSelectedSubordinate(event.target.value);
        const response = await fetch(
            `http://localhost:8080/api/tableinfo/getAvailableTablesToAdd/${adminName}/${selectedSubordinate}`
        );
    };

    return (
        <div style={{ marginLeft: '20px' }}>
            <select value={selectedSubordinate} onChange={handleSelect}>
                <option value="">Select a subordinate</option>
                {subordinates.map((subordinate) => (
                    <option key={subordinate.id} value={subordinate.id}>
                        {subordinate.name}
                    </option>
                ))}
            </select>
            {selectedSubordinate && (
                <div>
                    <h1>Select table to allow user to access:</h1>
                    <p>Selected subordinate: {selectedSubordinate.name}</p>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
