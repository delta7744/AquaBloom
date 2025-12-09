/**
 * MONGODB SCHEMAS
 * Tech Stack: Node.js, Mongoose
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- USER SCHEMA ---
const UserSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
  language: { type: String, enum: ['ar', 'fr', 'en'], default: 'ar' },
  createdAt: { type: Date, default: Date.now }
});

// --- FARM SCHEMA ---
const FarmSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  location: {
    type: String, // Storing as string for simplicity, or GeoJSON
    required: true
  },
  size: { type: Number, required: true }, // Hectares
  crops: [{
    cropType: String,
    plantingDate: Date,
    // Thresholds can be auto-populated based on cropType
    thresholds: {
      minMoisture: Number,
      maxTemp: Number
    }
  }],
  createdAt: { type: Date, default: Date.now }
});

// --- SENSOR DATA SCHEMA (TimeSeries) ---
const SensorDataSchema = new Schema({
  farmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  soilMoisture: Number,
  temperature: Number,
  humidity: Number,
  pH: Number,
  solarRadiation: Number
});

// --- IRRIGATION DECISION SCHEMA ---
const DecisionSchema = new Schema({
  farmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
  timestamp: { type: Date, default: Date.now },
  action: { type: String, enum: ['IRRIGATE', 'WAIT', 'SKIP'], required: true },
  durationMinutes: Number,
  reason: String,
  aiConfidence: Number, // 0-1
  executed: { type: Boolean, default: false }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Farm: mongoose.model('Farm', FarmSchema),
  SensorData: mongoose.model('SensorData', SensorDataSchema),
  Decision: mongoose.model('Decision', DecisionSchema)
};
