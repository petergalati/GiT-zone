import React from 'react';
import './App.css';
import MyMapComponent from './pages/MyMapComponent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
    return (
        <div>
            <header>
                CIVILIAN
            </header>
        <Router>
            <div className="App">
                <Routes>
                    <Route exact path='/' element={<LoginPage/>}/>
                    <Route path='/MyMapComponent' element={<MyMapComponent/>}/>
                </Routes>
            </div>
        </Router>
        </div>
    );
}

export default App;
