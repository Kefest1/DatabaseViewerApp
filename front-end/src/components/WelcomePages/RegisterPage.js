import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import BackGroundStyle from './BackGroundStyle'
import {Link} from "react-router-dom";
import InvalidDataLabel from "./InvalidDataLabel";


function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isVisible, setIsVisible] = useState('');
    const [caption, setCaption] = useState('');

    const [users, setUsers] = useState('');


    const ValidatePassword = () => {
        console.log(users)
        setIsVisible(true);
        if (password === "" || confirmPassword === "") {
            setCaption("No data");
            console.log("No data");
            return "No data"
        }
        else if (password.length <= 8 || confirmPassword.length <= 8) {
            console.log('Password is to short');
            setCaption("NOT OK");
            return "Passwords is to short"
        }
        else if (password !== confirmPassword) {
            console.log('Passwords do not match');
            setCaption("NOT OK");
            return "Passwords do not match"
        } else {
            console.log('Passwords match');
            setCaption("OK");
            return "OK"
        }

    }

    const Register = async () => {
        let errMessage = ValidatePassword()
        if (errMessage !== "OK") {
            setCaption(errMessage);
            return errMessage;
        }

        const response = await fetch('http://localhost:8080/api/checkExistenceByUsername/' + username);
        const is = await response.json();
        if (is === false)
            return false;


        return true;
    }

    return (
        <div>
            <div align="center">Database Viewer app</div>
            <div style={BackGroundStyle}
                 className="d-flex justify-content-center align-items-center vh-100">
                <div className='bg-white p-3 rounded w-25'>
                    {/*<form action="http://localhost:8080">*/}
                        <h1>Sign-Up</h1>
                        <div className='mb-3'>
                            <label htmlFor="username"><strong>Username</strong></label>
                            <input className='form-control rounded-0' type="username" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="email"><strong>Email</strong></label>
                            <input className='form-control rounded-0' type="text" placeholder="Enter Email"/>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="password"><strong>Password</strong></label>
                            <input className='form-control rounded-0' type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="retype_password"><strong>Retype Password</strong></label>
                            <input className='form-control rounded-0' type="password" placeholder="Enter Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="registration_code"><strong>Registration Code</strong></label>
                            <input className='form-control rounded-0' type="password" placeholder="Registration Code"/>
                        </div>

                        <button className='btn btn-success border w-100' onClick={Register}>Register</button>
                        <p></p>
                        <Link to="/login">
                            <button className='btn btn-light border-dark w-100'>Log in</button>
                        </Link>
                        {isVisible && <label>{caption}</label>}
                    {/*</form>*/}
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;
