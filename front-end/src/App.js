import './App.css';
import LoginPage from './components/WelcomePages/LoginPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from "./components/WelcomePages/RegisterPage";
import React from 'react';
import MainTest from "./components/DatabaseBrowser/MainTest";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<LoginPage/>}></Route>
                <Route path='/register' element={<RegisterPage/>}></Route>
                <Route path='/' element={<MainTest/>}></Route>
            </Routes>
        </BrowserRouter>
    );

}

export default App;
