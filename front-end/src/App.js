import './App.css';
import LoginPage from './components/WelcomePages/LoginPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from "./components/WelcomePages/RegisterPage";
import MainPage from "./components/DatabaseBrowser/MainPage";
import Sidebar from "./components/DatabaseBrowser/Sidebar";

function App() {
    return (
            <BrowserRouter>
                <Routes>
                    <Route path='/login' element={<LoginPage />}></Route>
                    <Route path='/register' element={<RegisterPage />}></Route>
                    <Route path='/' element={<MainPage />}></Route>
                </Routes>
            </BrowserRouter>
    )
}

export default App;
