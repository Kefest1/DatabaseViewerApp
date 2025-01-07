import React from "react";
import { getCookie } from "../getCookie";
import "./Header.css";

function getUserName() {
    return getCookie("userName");
}

function Header() {
    const userName = getUserName();

    return (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
                <h6 className="greeting">Hello {userName}</h6>
            </div>
            <button onClick={logOut} className="header-button">Log Out</button>
        </header>
    );
}

function logOut() {
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = 'http://localhost:3000/login';
}

export default Header;
