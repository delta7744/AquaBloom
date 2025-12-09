/**
 * AQUABLOOM BACKEND SERVER
 * Run with: node server.js
 */

const express = require('express');
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const cors = require('cors');
const apiRoutes = require('./routes');
const { SensorData, Farm } = require('./schemas');
const { evaluateIrrigation } = require('./irrigation');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://broker.hivemq.com';

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.DB_CONNECT || 'mongodb://localhost:27017/aquabloom', 
  { useNewUrlParser: true, useUnifiedTopology: true }, 
  () => console.log('Connected to MongoDB')
);

// Routes
app.use('/api', apiRoutes);

// --- MQTT IOT SERVICE ---
const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
  console.log('Connected to MQTT Broker');
  mqttClient.subscribe('aquabloom/+/sensor'); // + wildcard for farmId
});

mqttClient.on('message', async (topic, message) => {
  // Topic: aquabloom/{farmId}/sensor
  const farmId = topic.split('/')[1];
  const payload = JSON.parse(message.toString());

  console.log(`Received data from ${farmId}:`, payload);

  // 1. Save Sensor Data
  const sensorRecord = new SensorData({
    farmId: farmId,
    ...payload
  });
  await sensorRecord.save();

  // 2. Trigger Real-time Logic (Optional, usually done via API polling or WebSocket push)
  // For this demo, we assume the actuator subscribes to 'aquabloom/{farmId}/actuator'
  
  // Fetch farm config
  // const farm = await Farm.findById(farmId);
  // const decision = evaluateIrrigation(payload, farm.crops[0].cropType);
  
  // if (decision.action === 'IRRIGATE') {
  //   mqttClient.publish(`aquabloom/${farmId}/actuator`, JSON.stringify({
  //       command: 'ON',
  //       duration: decision.duration
  //   }));
  // }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
