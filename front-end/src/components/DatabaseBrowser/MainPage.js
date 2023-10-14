import {getCookie, isCookie} from "../getCookie";
import React from "react";
import Sidebar from "./Sidebar";

function MainPage() {
    // const x = localStorage.getItem("Data1");
    // localStorage.removeItem("Data1");
    // const d = sessionStorage.getItem("Data2");
    const userName = getCookie('userName');

    if (userName) {
        return (
            <div>
                <div align="center">User {userName} is logged in.</div>
                <Sidebar />
            </div>
        );
    }
    else {
        window.location.href = 'http://localhost:3000/login';
    }

}

export default MainPage;
