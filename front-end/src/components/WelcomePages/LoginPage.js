import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import BackGroundStyle from './BackGroundStyle'
import InvalidDataLabel from "./InvalidDataLabel";
import { FaUser , FaLock } from 'react-icons/fa';
import {IconButton, Paper, Snackbar, SnackbarContent} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import {InfoIcon} from "lucide-react";

const MAX_USERNAME_LENGTH = 20;
const MAX_PASSWORD_LENGTH = 20;

function LoginPage() {
    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("");

    const [openSnackbarOk, setOpenSnackbarOk] = useState(false);

    useEffect(() => {
        document.title = "Login Page";
    }, []);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCloseSnackbarOk = () => {
        setOpenSnackbarOk(false);
    };

    const Login = async () => {
        if (username.length === 0) {
            setMessage("Enter username");
            setOpenSnackbar(true);
            return;
        }
        if (password.length === 0) {
            setMessage("Enter password");
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            console.log("Login button clicked");

            if (!response.ok) {
                console.error('Fetch error:', response.status, response.statusText);
                throw new Error('Network response was not ok');
            }

            const token = await response.text();
            console.log(token);

            if (token) {
                console.log("Login button clicked");
                localStorage.setItem("jwtToken", token);
                setOpenSnackbarOk(true);

                const adminResponse = await fetch(`http://localhost:8080/api/userinfo/checkifadmin/${username}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        method: 'GET'
                    },
                );
                const isAdmin = await adminResponse.json();

                const expirationTime = new Date();
                expirationTime.setTime(expirationTime.getTime() + 60 * 180 * 1100);

                const expirationTimeInfo = new Date();
                expirationTimeInfo.setTime(Date.now() + 60 * 180 * 1000);

                document.cookie = `userName=${username}; expires=${expirationTime.toUTCString()}; secure; samesite=strict`;
                document.cookie = `isAdmin=${isAdmin}; expires=${expirationTime.toUTCString()}; secure; samesite=strict`;
                document.cookie = `isExp=true; expires=${expirationTimeInfo.toUTCString()}; secure; samesite=strict`;
                document.cookie = `isExpTimestamp=${expirationTimeInfo.getTime()}; expires=${expirationTimeInfo.toUTCString()}; secure; samesite=strict`;
                console.log("token");

                window.location.href = 'http://localhost:3000';
            } else {
                console.log("Invalid user or password");
                setMessage("User  not found");
                setOpenSnackbar(true);
                setPassword("");
            }
        } catch (error) {
            setPassword("");
            setMessage("There was a problem with the fetch operation. Please try again later");
            setOpenSnackbar(true);
        }
    }

    return (
        <Paper sx={{ width: '100vw', height: '100vh', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div align="center" className="mb-2">
                <h3>Database Viewer App</h3>
            </div>
            <div style={BackGroundStyle} className="d-flex justify-content-center align-items-center vh-100" >
                <div className='bg-white p-4 rounded shadow w-25'>
                    <h2 className="text-center mb-4">Log in</h2>
                    <div className='mb-3'>
                        <label htmlFor="username"><strong>Username</strong></label>
                        <div className="input-group">
                            <span className="input-group-text"><FaUser  /></span>
                            <input
                                className='form-control rounded-0'
                                type="text"
                                placeholder="Enter Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ height: '50px', fontSize: '16px', padding: '10px' }}
                                maxLength={MAX_USERNAME_LENGTH}
                            />
                        </div>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <div className="input-group">
                            <span className="input-group-text"><FaLock /></span>
                            <input
                                className='form-control rounded-0'
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ height: '50px', fontSize: '16px', padding: '10px' }}
                                maxLength={MAX_PASSWORD_LENGTH}
                            />
                        </div>
                    </div>
                    <button onClick={Login} className='btn btn-success w-100 mb-2'>Log in</button>
                    <Link to="/register">
                        <button className='btn btn-light border-dark w-100'>Register</button>
                    </Link>
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                    >
                        <SnackbarContent
                            style={{ backgroundColor: '#f44336' }}
                            message={
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                            <ErrorIcon style={{ marginRight: 8 }} />
                                    {message}
                        </span>
                            }
                            action={[
                                <IconButton
                                    key="close"
                                    aria-label="close"
                                    color="inherit"
                                    onClick={handleCloseSnackbar}
                                >
                                    <CloseIcon />
                                </IconButton>,
                            ]}
                        />
                    </Snackbar>
                    <Snackbar
                        open={openSnackbarOk}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbarOk}
                    >
                        <SnackbarContent
                            style={{ backgroundColor: '#117311' }}
                            message={
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <InfoIcon style={{ marginRight: 8 }} />
                                    {"Login successful"}
                                </span>
                            }
                            action={[
                                <IconButton
                                    key="close"
                                    aria-label="close"
                                    color="inherit"
                                    onClick={handleCloseSnackbar}
                                >
                                    <CloseIcon />
                                </IconButton>,
                            ]}
                        />
                    </Snackbar>
                </div>
            </div>
        </Paper>
    );
}

export default LoginPage;
