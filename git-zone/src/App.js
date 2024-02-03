import React from 'react';
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import './App.css';
import badMap from './components/map'

function App() {

    const badmap = badMap()
    return (
        <div className="App">


            <header className="App-header">
                <p>
                    GiT-zone
                </p>
            </header>
            <div style={{ height: '75vh', width: '75%' }}>
            {badmap}
        </div>
        </div>
    );
}

export default App;
