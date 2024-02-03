import React from 'react';
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import './App.css';
import badMap from './components/map'

function App() {

    const badmap = badMap()
    return (
        <div className="App">
            <div style={{ height: '50vh', width: '25%' }}>
                {badmap}
            </div>

            <header className="App-header">
                <p>
                    GiT-zone
                </p>
            </header>
        </div>
    );
}

export default App;
