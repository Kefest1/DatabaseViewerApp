import './App.css';
import LoginPage from './components/WelcomePages/LoginPage';
import RegisterPage from "./components/WelcomePages/RegisterPage";
import MainTest from "./components/DatabaseBrowser/MainTest";
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import './index.css';

// Component to handle animations
function AnimatedRoutes() {
    const location = useLocation();

    const pageVariants = {
        initial: {
            opacity: 0,
            x: "-100vw",
        },
        animate: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.2 },
        },
        exit: {
            opacity: 0,
            x: "100vw",
            transition: { duration: 0.2 },
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
                    <Route path='/' element={<MainTest />} />
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
