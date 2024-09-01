import React, { useState } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import BackGroundStyle from './BackGroundStyle'
import InvalidDataLabel from "./InvalidDataLabel";


function LoginPage() {
    const [IsVisible, setIsVisible] = useState(false)
    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    const [errCode, setErrCode] = useState('');



    const Login = async () => {
        if (username.length === 0) {
            setErrCode("Enter username")
            setIsVisible(true);
            return;
        }
        if (password.length === 0) {
            setErrCode("Enter password")
            setIsVisible(true);
            return;
        }
        const response = await fetch('http://localhost:8080/api/userinfo/getByUsername?userName=' + username);
        const text = await response.json();

        let foundPassword = text.password_hash;

        console.log(foundPassword);
        if (foundPassword === password) {
            localStorage.setItem("Data1", "Value123OK");
            sessionStorage.setItem("Data2", "V02");
            setErrCode("Ok");
            setIsVisible(true);
            const expirationTime = new Date();
            expirationTime.setTime(expirationTime.getTime() + 60 * 180 * 1000);
            document.cookie = 'userName=' + username + '; expires=' + expirationTime.toUTCString() + '; secure; samesite=strict ';
            window.location.href = 'http://localhost:3000';
        } else {
            console.log("Invalid password try again");
            setErrCode("Invalid user or password");
            setIsVisible(true);
        }

    }

    return (
        <div>
            <div align="center">Database Viewer app</div>
            <div style={BackGroundStyle}
                 className="d-flex justify-content-center align-items-center vh-100">
                <div className='bg-white p-3 rounded w-25'>
                    {/*<form>*/}
                        <div className='mb-3'>
                            <label htmlFor="username"><strong>Username</strong></label>
                            <input className='form-control rounded-0' type="text" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="password"><strong>Password</strong></label>
                            <input className='form-control rounded-0' type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button onClick={Login} className='btn btn-success w-100'>Log in</button>
                        <p></p>
                        <Link to="/register">
                            <button
                                className='btn btn-light border-dark w-100'
                                style={{ marginTop: '10px' }}
                            >Register</button>
                        </Link>
                        {IsVisible && <InvalidDataLabel errCode={errCode}/>}
                    {}
                </div>
            </div>
        </div>
    )
}

export default LoginPage;
