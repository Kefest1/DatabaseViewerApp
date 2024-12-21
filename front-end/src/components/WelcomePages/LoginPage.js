import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import BackGroundStyle from './BackGroundStyle'
import InvalidDataLabel from "./InvalidDataLabel";
import { FaUser , FaLock } from 'react-icons/fa';

function LoginPage() {
    const [IsVisible, setIsVisible] = useState(false)
    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    const [errCode, setErrCode] = useState('');

    useEffect(() => {
        document.title = "Login Page";
    }, []);

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

        let data;
        try {
            const response = await fetch('http://localhost:8080/api/userinfo/getByUsername?userName=' + username);

            if (!response.ok) {
                console.error('Fetch error:', response.status, response.statusText);
                throw new Error('Network response was not ok');
            }

            data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setPassword("");
            setErrCode("There was a problem with the fetch operation. Please try again later");
            return;
        }

        if (data.password_hash === password) {
            console.log("Login");
            const response = await fetch('http://localhost:8080/api/userinfo/checkifadmin/' + username);
            const isAdmin = await response.json();

            setErrCode("Login successful");
            setIsVisible(true);
            const expirationTime = new Date();
            expirationTime.setTime(expirationTime.getTime() + 60 * 180 * 1000);
            document.cookie = 'userName=' + username + '; expires=' + expirationTime.toUTCString() + '; secure; samesite=strict ';
            document.cookie = `isAdmin=${isAdmin}; expires=${expirationTime.toUTCString()}; secure; samesite=strict`;

            window.location.href = 'http://localhost:3000';
        } else {
            console.log("Invalid password try again");
            setErrCode("Invalid user or password");
            setIsVisible(true);
            setPassword("");
        }
    }

    return (
        <div>
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
                            />
                        </div>
                    </div>
                    <button onClick={Login} className='btn btn-success w-100 mb-2'>Log in</button>
                    <Link to="/register">
                        <button className='btn btn-light border-dark w-100'>Register</button>
                    </Link>
                    {IsVisible && <InvalidDataLabel errCode={errCode} />}
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
