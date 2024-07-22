// Nombre de integrantes: GRUPO #5
// Dustin Rugel
// Jhonny Castillo
// David Vilañez
// Derek Cedeño

const express = require('express');
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function main() {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    const db = client.db('parking');
    const collection = db.collection('vehicles');

    // Mostrar todos los vehículos
    app.get('/vehicles', async (req, res) => {
        const vehicles = await collection.find({}).toArray();
        res.send(vehicles);
    });

    // Añadir un vehículo
    app.post('/addVehicle', async (req, res) => {
        const { plate, model, color } = req.body;
        if (!plate || !model || !color) {
            return res.status(400).send({ error: 'All fields are required' });
        }
        await collection.insertOne({ plate, model, color });
        res.send({ success: true });
    });

    // Actualizar información de un vehículo
    app.put('/updateVehicle', async (req, res) => {
        const { plate, model, color } = req.body;
        if (!plate || !model || !color) {
            return res.status(400).send({ error: 'All fields are required' });
        }
        await collection.updateOne({ plate }, { $set: { model, color } });
        res.send({ success: true });
    });

    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
}

main().catch(console.error);
