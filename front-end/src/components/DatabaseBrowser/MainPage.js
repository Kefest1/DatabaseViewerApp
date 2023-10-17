import {getCookie, isCookie} from "../getCookie";
import React from "react";
import Sidebar from "./Sidebar";
import ConnectToDatabase from "./ConnectToDatabase";

function MainPage() {
    const userName = getCookie('userName');

    if (userName) {
        return (
            <div>
                <div align="center">User {userName} is logged in.</div>
                <ConnectToDatabase />
            </div>
        );
    }
    else {
        window.location.href = 'http://localhost:3000/login';
    }

}

export default MainPage;
    