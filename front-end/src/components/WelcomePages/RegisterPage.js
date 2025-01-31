import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import BackGroundStyle from './BackGroundStyle'
import {Link} from "react-router-dom";
import {Paper} from "@mui/material";

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [adminUsername, setAdminUsername] = useState('');
    const [hash, setHash] = useState('');

    const [isVisible, setIsVisible] = useState('');
    const [caption, setCaption] = useState('');


    useEffect(() => {
        document.title = "Register Page";
    }, []);

    const MAX_USERNAME_LENGTH = 20;
    const MAX_ADMIN_USERNAME_LENGTH = MAX_USERNAME_LENGTH;
    const MAX_EMAIL_LENGTH = 50;
    const MAX_PASSWORD_LENGTH = 20;
    const MAX_HASH_LENGTH = 50;

    const ValidatePassword = () => {
        setIsVisible(true);

        if (password === "" || confirmPassword === "" || username === "" || email === "") {
            return "Please fill in all required fields";
        }
        else if (username.length < 8) {
            return "Username is too short";
        }
        else if (username.length > MAX_USERNAME_LENGTH) {
            return `Username must be less than ${MAX_USERNAME_LENGTH + 1} characters`;
        }
        else if (password.length < 8 || confirmPassword.length < 8) {
            return "Password is too short";
        }
        else if (password.length > MAX_PASSWORD_LENGTH) {
            return `Password must be less than ${MAX_PASSWORD_LENGTH + 1} characters`;
        }
        else if (password !== confirmPassword) {
            return "Passwords do not match";
        } else {
            return "OK";
        }
    }

    const validateData = () => {
        if (adminUsername === '' && hash === '') {
            return "Give hash or admin username";
        }
        if (adminUsername !== '' && hash !== '') {
            return "Give either hash or admin username";
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            return "Email is not valid";
        }
        if (email.length > MAX_EMAIL_LENGTH) {
            return `Email must be less than ${MAX_EMAIL_LENGTH + 1} characters`;
        }
        if (adminUsername.length > MAX_ADMIN_USERNAME_LENGTH) {
            return `Admin username must be less than ${MAX_ADMIN_USERNAME_LENGTH + 1} characters`;
        }
        if (hash.length > MAX_HASH_LENGTH) {
            return `Hash must be less than ${MAX_HASH_LENGTH + 1} characters`;
        }
        return "OK";
    }

    const Register = async () => {
        let errMessage = ValidatePassword();
        if (errMessage !== "OK") {
            setCaption(errMessage);
            return errMessage;
        }
        errMessage = validateData();
        if (errMessage !== "OK") {
            setCaption(errMessage);
            return errMessage;
        }

        let isRegistered = true;

        const userPayload = {
            "username" : username,
            "email" : email,
            "password_hash" : password,
            "hash" : hash,
            "adminName" : adminUsername,
        }

        fetch('http://localhost:8080/api/userinfo/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userPayload),
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        isRegistered = false;
                        throw new Error(`Error ${response.status}: ${errorMessage}`);
                    });
                }
                return response.text();
            })
            .then(data => {
                setCaption(data);
                console.log("Success:", data);
            })
            .catch(error => {
                setCaption(error.message);
                console.error("Error:", error);
            });

        return isRegistered;
    }

    return (
        <Paper sx={{ width: '100vw', height: '100vh', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div align="center" className="mb-2">
                <h3>Database Viewer App</h3>
            </div>
            <div style={BackGroundStyle}
                 className="d-flex justify-content-center align-items-center vh-100">
                <div className='bg-white p-3 rounded w-35'>
                    <h1>Sign-Up</h1>
                    <div className='mb-3'>
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input className='form-control rounded-0' type="username" placeholder="Enter Username"
                               value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input className='form-control rounded-0' type="text" placeholder="Enter Email" value={email}
                               onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input className='form-control rounded-0' type="password" placeholder="Enter Password"
                               value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="retype_password"><strong>Confirm Password</strong></label>
                        <input className='form-control rounded-0' type="password" placeholder="Enter Password"
                               value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="username"><strong>Admin username (not required when registering as an
                            admin)</strong></label>
                        <input className='form-control rounded-0' type="text" placeholder="Master username"
                               value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)}/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="username"><strong>Hash (use only when registering as an admin)</strong></label>
                        <input className='form-control rounded-0' type="text" placeholder="Master username" value={hash}
                               onChange={(e) => setHash(e.target.value)}/>
                    </div>

                    <button className='btn btn-success border w-100' onClick={Register}>Register</button>
                    <Link to="/login">
                        <button
                            className='btn btn-light border-dark w-100'
                            style={{marginTop: '10px'}}
                        >
                            Log in
                        </button>

                    </Link>
                    {isVisible && <label>{caption}</label>}
                </div>
            </div>
        </Paper>
    )
}

export default RegisterPage;
