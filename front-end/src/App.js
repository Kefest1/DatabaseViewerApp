import './App.css';
import LoginPage from './components/WelcomePages/LoginPage';
import RegisterPage from "./components/WelcomePages/RegisterPage";
import Main from "./components/DatabaseBrowser/Main";
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import './index.css';

function AnimatedRoutes() {
    const location = useLocation();

    const pageVariants = {
        initial: {
            opacity: 0,
            scale: 0.9,
        },
        animate: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, ease: "easeInOut" },
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.3, ease: "easeInOut" },
        },
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <Routes location={location} key={location.pathname}>
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/register' element={<RegisterPage />} />
                    <Route path='/' element={<Main />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
}


function App() {
    return (
        <BrowserRouter>
            <AnimatedRoutes />
        </BrowserRouter>
    );
}

export default App;
