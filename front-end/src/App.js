import './App.css';
import LoginPage from './components/WelcomePages/LoginPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from "./components/WelcomePages/RegisterPage";
import InvalidDataLabel from "./components/WelcomePages/InvalidDataLabel";

function App() {
    return (
            <BrowserRouter>
                <Routes>
                    <Route path='/login' element={<LoginPage />}></Route>
                    <Route path='/register' element={<RegisterPage />}></Route>
                </Routes>
            </BrowserRouter>
    )
}

export default App;
