import React, { useEffect, useState } from "react";
import { getCookie } from "../getCookie";
import "./Header.css";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function getUserName() {
    return getCookie("userName");
}

async function fetchAvailableDatabases(userName) {
    const tables = await fetch(
        "http://localhost:8080/api/tableinfo/getAvailableDatabases/" + userName
    );
    return await tables.json();
}

function Header() {
    const userName = getUserName();
    const [tablesData, setTablesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAvailableDatabases(userName)
            .then((data) => {
                setTablesData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, [userName]);


    return (
        <header>
            <h6 align={"center"}>Available databases for {userName}:</h6>
            {loading ? (
                <p align={"center"}>Loading...</p>
            ) : (
                <Autocomplete
                    options={tablesData}
                    renderInput={(params) => <TextField {...params} label="Display Database" variant="outlined" style={{height: '10px', margin: 'auto'}} />}
                    onChange={(event, newValue) => {
                        console.log(newValue);
                    }}
                    style={{ width: '125px', height: '35px', margin: 'auto' }}
                />
            )}
        </header>
    );
}

export default Header;
