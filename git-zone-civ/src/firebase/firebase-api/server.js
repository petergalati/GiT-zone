// import { db } from '../setup.js';
import { addZone, getZones, getLatestPosition, addCivilian } from '../query.js';
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

// Endpoint to add a civilian
expressApp.post('/addCivilian', async (req, res) => {
    try {
        const data = req.body;
        const response = await addCivilian(data);
        res.status(200).send(`Civilian added with response: ${JSON.stringify(response)}`);
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


// dhillons terra stuff
// dhillons terra stuff
expressApp.get('/getLatestPosition', async (req, res) => {
    try {
        const positions = await getLatestPosition();
        // console.log(positions);
        res.status(200).json(positions);
    } catch (error) {
        res.status(500).send(error.message);
    }
});