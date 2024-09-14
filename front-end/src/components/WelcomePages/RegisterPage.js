import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import BackGroundStyle from './BackGroundStyle'
import {Link} from "react-router-dom";


function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [adminUsername, setAdminUsername] = useState('');
    const [hash, setHash] = useState('');

    const [isVisible, setIsVisible] = useState('');
    const [caption, setCaption] = useState('');

    const [users, setUsers] = useState('');

    const ValidatePassword = () => {
        console.log(users);
        setIsVisible(true);

        if (password === "" || confirmPassword === "") {
            console.log("No data");
            return "No data"
        }
        else if (password.length <= 8 || confirmPassword.length <= 8) {
            console.log('Password is to short');
            return "Passwords is to short"
        }
        else if (password !== confirmPassword) {
            console.log('Passwords do not match');
            return "Passwords do not match"
        } else {
            console.log('Passwords match');
            return "OK"
        }

    }

    const validateData = () => {
      if (adminUsername === '' && hash === '') {
          return "Give hash or admin username";
      }
      if (adminUsername !== '' && hash !== '') {
          return "Give either hash or admin username";
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

        const response = await fetch('http://localhost:8080/api/userinfo/checkExistenceByUsername/' + username);
        const is = await response.json();

        const userPayload = {
            "username" : username,
            "email" : email,
            "password_hash" : password,
            "hash" : hash,
            "adminName" : adminUsername,
        }

        fetch('http://localhost:8080/api/userinfo/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userPayload)
        })
            .then(response => response.text())
            .then(data => {
                setCaption(data);
                console.log(data);
            })
            .then(data => console.log(data))
            .catch(error => console.error(error));

        return is !== false;
    }

    return (
        <div>
            <div align="center">Database Viewer app</div>
            <div style={BackGroundStyle}
                 className="d-flex justify-content-center align-items-center vh-100">
                <div className='bg-white p-3 rounded w-35'>
                        <h1>Sign-Up</h1>
                        <div className='mb-3'>
                            <label htmlFor="username"><strong>Username</strong></label>
                            <input className='form-control rounded-0' type="username" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="email"><strong>Email</strong></label>
                            <input className='form-control rounded-0' type="text" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="password"><strong>Password</strong></label>
                            <input className='form-control rounded-0' type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="retype_password"><strong>Confirm Password</strong></label>
                            <input className='form-control rounded-0' type="password" placeholder="Enter Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="username"><strong>Admin username (not required when registering as an admin)</strong></label>
                            <input className='form-control rounded-0' type="text" placeholder="Master username" value={adminUsername}  onChange={(e) => setAdminUsername(e.target.value)}/>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="username"><strong>Hash (use only when registering as an admin)</strong></label>
                            <input className='form-control rounded-0' type="text" placeholder="Master username" value={hash} onChange={(e) => setHash(e.target.value)} />
                        </div>

                        <button className='btn btn-success border w-100' onClick={Register}>Register</button>
                        <p></p>
                        <Link to="/login">
                            <button
                                className='btn btn-light border-dark w-100'
                                style={{ marginTop: '10px' }}
                            >
                                Log in</button>

                        </Link>
                        {isVisible && <label>{caption}</label>}
                    {}
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;
