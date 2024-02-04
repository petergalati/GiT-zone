// import { db } from '../setup.js';
import { addZone, getZones, getLatestPosition, getCivilians } from '../query.js';
import express from 'express';
import { collection, getDocs } from 'firebase/firestore';


const expressApp = express();
const port = 3001;

expressApp.use(express.json());

expressApp.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Endpoint to add a zone
expressApp.post('/addZone', async (req, res) => {
    try {
        const data = req.body;
        const response = await addZone(data);
        res.status(200).send(`Zone added with response: ${JSON.stringify(response)}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Endpoint to get zones
expressApp.get('/getZones', async (req, res) => {

    // console.log(db);
    try {
        const zones = await getZones();
        res.status(200).json(zones);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// Endpoint to get civilians
expressApp.get('/getCivilians', async (req, res) => {

    // console.log(db);
    try {
        const civilians = await getCivilians();
        res.status(200).json(civilians);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// dhillons terra stuff
expressApp.get('/getLatestPosition', async (req, res) => {
    try {
        const positions = await getLatestPosition();
        const lastPosSamples = [];
        for (let i = 0; i < positions.length; i++) {
            // posData.push(positions[i].position_data);
            const posSample = positions[i].position_data.position_samples;
            const lastPosSample = posSample[posSample.length - 1];
            lastPosSamples.push(lastPosSample);
        }
        console.log(lastPosSamples);
        res.status(200).json(lastPosSamples);
    } catch (error) {
        res.status(500).send(error.message);
    }
});