import {getCookie, isCookie} from "../getCookie";
import React from "react";

async function MainPage() {
    const userName = getCookie('userName');
    const availableTables = await fetch('');

    if (userName) {
        return (
            <div>
                <label align="center">User {userName} is logged in.</label>
            </div>
        );
    } else {
        window.location.href = 'http://localhost:3000/login';
    }

}

export default MainPage;
