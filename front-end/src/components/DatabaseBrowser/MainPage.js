import {getCookie, isCookie} from "../getCookie";
import React from "react";
import Sidebar from "./Sidebar";

function MainPage() {
    const userName = getCookie('userName');

    if (userName) {
        return (
            <div>
                <label align="center">User {userName} is logged in.</label>
            </div>
        );
    }
    else {
        window.location.href = 'http://localhost:3000/login';
    }

}

export default MainPage;
