/**
 * IRRIGATION DECISION ENGINE
 * Combines hard rules with AI optimization
 */

const CROP_THRESHOLDS = {
  'Tomato': { minMoisture: 60, maxTemp: 30 },
  'Olive': { minMoisture: 30, maxTemp: 40 },
  'Strawberry': { minMoisture: 70, maxTemp: 25 },
  'Wheat': { minMoisture: 40, maxTemp: 35 },
  'Citrus': { minMoisture: 50, maxTemp: 35 }
};

/**
 * Evaluates sensor data and returns an irrigation command.
 * @param {Object} sensorData - { soilMoisture, temperature, humidity }
 * @param {String} cropType - e.g., 'Tomato'
 * @param {Object} weatherForecast - (Optional) external weather data
 */
function evaluateIrrigation(sensorData, cropType, weatherForecast = null) {
  const rules = CROP_THRESHOLDS[cropType] || CROP_THRESHOLDS['Tomato'];
  const { soilMoisture, temperature, humidity } = sensorData;
  
  let decision = {
    action: 'WAIT',
    duration: 0,
    reason: 'Conditions are optimal.',
    urgency: 'LOW'
  };

  // 1. CRITICAL SAFETY RULES
  if (temperature > 35 && soilMoisture < rules.minMoisture) {
    return {
      action: 'IRRIGATE',
      duration: 30, // minutes
      reason: 'Critical heat stress detected.',
      urgency: 'HIGH'
    };
  }

  // 2. STANDARD IRRIGATION RULES
  if (soilMoisture < rules.minMoisture) {
    // Check humidity to avoid fungal disease during irrigation
    if (humidity > 80) {
      return {
        action: 'WAIT',
        duration: 0,
        reason: 'High humidity detected. Irrigation postponed to prevent disease.',
        urgency: 'MEDIUM'
      };
    }
    
    // Check forecast (if available)
    if (weatherForecast && weatherForecast.rainProbability > 60) {
       return {
        action: 'WAIT',
        duration: 0,
        reason: 'Rain expected shortly.',
        urgency: 'LOW'
      };
    }

    // Default Irrigation
    const deficit = rules.minMoisture - soilMoisture;
    const duration = Math.min(Math.max(Math.round(deficit * 1.5), 15), 60); // Simple calculation
    
    return {
      action: 'IRRIGATE',
      duration: duration,
      reason: `Soil moisture (${soilMoisture}%) is below target (${rules.minMoisture}%).`,
      urgency: 'MEDIUM'
    };
  }

  // 3. DISEASE RISK MONITORING
  if (humidity > 85 && temperature > 20 && temperature < 30) {
    return {
        action: 'MONITOR_DISEASE',
        duration: 0,
        reason: 'Conditions favor fungal growth.',
        urgency: 'HIGH'
    };
  }

  return decision;
}

module.exports = { evaluateIrrigation };
