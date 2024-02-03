import { db } from '../query.js';

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Endpoint to add a zone
app.post('/addZone', async (req, res) => {
    try {
        const data = req.body;
        const response = await db.collection('zones').add(data);
        res.status(200).send(`Zone added with ID: ${response.id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Endpoint to get zones
app.get('/getZones', async (req, res) => {
    try {
        const zones = [];
        const querySnapshot = await db.collection('zones').get();
        querySnapshot.forEach((doc) => {
            zones.push(doc.data());
        });
        res.status(200).json(zones);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
