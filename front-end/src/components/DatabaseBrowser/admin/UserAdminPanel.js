import React, {useEffect, useState} from "react";
import {getCookie} from "../../getCookie";
import {Grid2, Paper, Typography} from "@mui/material";

async function fetchAdminName() {
    const userName = getCookie("userName");
    console.log("http://localhost:8080/api/userinfo/getAdmin/" + userName);

    const token = localStorage.getItem("jwtToken");
    const res = await fetch("http://localhost:8080/api/userinfo/getAdmin/" + userName, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return await res.text()
}

async function fetchAdminMail() {
    const userName = getCookie("userName");
    console.log("http://localhost:8080/api/userinfo/getAdminMail/" + userName);

    const token = localStorage.getItem("jwtToken");

    const res = await fetch("http://localhost:8080/api/userinfo/getAdminMail/" + userName, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return await res.text()
}

function UserAdminPanel() {
    const [adminName, setAdminName] = useState("");
    const [adminMail, setAdminMail] = useState("");
    useEffect(() => {
        fetchAdminName().then((adminNameTemp) => {
            setAdminName(adminNameTemp);
        });
        fetchAdminMail().then((adminMail) => {
            setAdminMail(adminMail);
        });
    }, []);

    const [showInfo, setShowInfo] = useState(false);

    const handleEmailClick = () => {
        setShowInfo(true);
    };

    return (
        <div>
            <Paper sx={{ width: 'calc(80vw)', height: 'calc(86vh)', overflow: 'auto' }} elevation={3} style={{ padding: '20px', margin: '10px', borderRadius: '8px' }}>
                <Grid2 container spacing={2} style={{ padding: '10px' }}>
                    <Grid2 item xs={12}>
                        <Paper sx={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                            <Typography variant="h6" color="error" align="center">
                                You are not an admin. Please contact the admin <b>{adminName}</b> at{' '}
                                <a href={`mailto:${adminMail}`} onClick={handleEmailClick} style={{ color: '#1976d2', textDecoration: 'underline' }}>
                                    {adminMail}
                                </a>{' '}
                                to get more tables to browse.
                            </Typography>
                        </Paper>
                    </Grid2>
                </Grid2>
                {showInfo && (
                <Paper sx={{ marginTop: '10px', padding: '10px', backgroundColor: '#e0f7fa', borderRadius: '8px' }}>
                    <Typography variant="body1" align="center">
                        Your email application will open shortly...
                    </Typography>
                </Paper>
            )}
            </Paper>

        </div>
    );
}

export default UserAdminPanel;
