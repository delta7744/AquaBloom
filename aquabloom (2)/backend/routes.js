/**
 * API ROUTES
 */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Farm, SensorData, Decision } = require('./schemas');
const { evaluateIrrigation } = require('./irrigation');

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access Denied');
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

// --- AUTH ROUTES ---
router.post('/auth/register', async (req, res) => {
  // Hash password & create user logic here
  res.json({ message: "User registered" });
});

router.post('/auth/login', async (req, res) => {
  // Validate credentials & issue JWT
  const token = jwt.sign({ _id: "dummy_id" }, process.env.JWT_SECRET);
  res.header('auth-token', token).json({ token });
});

// --- FARM ROUTES ---
router.post('/farms', auth, async (req, res) => {
  try {
    const farm = new Farm({ ...req.body, ownerId: req.user._id });
    await farm.save();
    res.json(farm);
  } catch(e) { res.status(400).send(e.message); }
});

router.get('/farms/me', auth, async (req, res) => {
    // Return user's farms
});

// --- SENSOR & DECISION ROUTES ---
router.get('/decisions/latest/:farmId', auth, async (req, res) => {
    const latestSensor = await SensorData.findOne({ farmId: req.params.farmId }).sort({ timestamp: -1 });
    const farm = await Farm.findById(req.params.farmId);
    
    if (!latestSensor || !farm) return res.status(404).send("No data");

    // Call Decision Engine
    const decision = evaluateIrrigation(latestSensor, farm.crops[0].cropType);
    
    // Save decision history
    const decisionRecord = new Decision({ 
        farmId: farm._id, 
        action: decision.action, 
        durationMinutes: decision.duration,
        reason: decision.reason
    });
    await decisionRecord.save();

    res.json(decision);
});

module.exports = router;
