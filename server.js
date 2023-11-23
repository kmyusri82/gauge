
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mqtt = require('mqtt');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const MQTT_HOST = 'mqtt://broker.emqx.io:1883';
const MQTT_TOPIC = 'kmyusri';

// Serve static files from the public directory
app.use(express.static('public'));  // <-- This line was added

// Connect to the MQTT broker
const client = mqtt.connect(MQTT_HOST);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(MQTT_TOPIC);
});

client.on('message', (topic, message) => {
    if (topic === MQTT_TOPIC) {
        const data = JSON.parse(message);
        if (data && data.moisture_value) {
            io.emit('moisture_data', data.moisture_value);
        }
    }
});



app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('index1'));

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

io.on('connection', (client) => {
    console.log('Client connected to socket.io');
    
    // Emit a test value
    // setTimeout(() => {
    //     client.emit('moisture_data', {moisture_value: 500});
    // }, 5000);
});

