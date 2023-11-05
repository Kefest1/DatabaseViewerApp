import React from 'react';
import DatabaseInfoPanel from './DatabaseInfoPanel';
import DatabaseContent from './DatabaseContent';
import RegisterPage from "../WelcomePages/RegisterPage";
import LoginPage from "../WelcomePages/LoginPage";
import Header from "./Header";

const MainTest = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ flex: '0 0 auto', background: 'lightblue' }}>
                {/* Header Content */}
                <Header />
            </div>
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ flex: 1 }}>
                    <DatabaseInfoPanel />
                </div>
                <div style={{ flex: 3 }}>
                    <DatabaseContent />
                </div>
            </div>

        </div>
    );
}
// <div style={{ flex: '0 0 auto', background: 'lightblue' }}>
//                 {/* Footer Content */}
//                 <footer>
//                     {/* Add your footer content here */}
//                     <p>Footer Content</p>
//                 </footer>
//             </div>


export default MainTest;
