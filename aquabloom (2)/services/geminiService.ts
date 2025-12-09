
import { GoogleGenAI } from "@google/genai";
import { SensorData, FarmData, AIRecommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getIrrigationRecommendation = async (
  sensorData: SensorData,
  farmData: FarmData
): Promise<AIRecommendation> => {
  try {
    const prompt = `
      You are an expert agronomist assistant for a Tunisian farmer.
      Analyze the following data and provide a concise, farmer-friendly recommendation.
      
      Farm Context:
      - Crop: ${farmData.cropType}
      - Location: ${farmData.location}
      
      Sensor Readings:
      - Soil Moisture: ${sensorData.soilMoisture}%
      - Temperature: ${sensorData.temperature}°C
      - Humidity: ${sensorData.humidity}%
      - pH: ${sensorData.soilPH}
      
      Output ONLY JSON in this format:
      {
        "action": "IRRIGATE" | "WAIT" | "MONITOR_DISEASE",
        "title": "Short headline (e.g., Irrigate Today)",
        "details": "Simple explanation (max 20 words)",
        "urgency": "LOW" | "MEDIUM" | "HIGH",
        "waterAmount": "Amount in Liters (optional)",
        "duration": "Time in minutes (optional)"
      }
      
      Do not include markdown code blocks. Just the raw JSON string.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return { ...data, timestamp: Date.now() } as AIRecommendation;

  } catch (error: any) {
    // Graceful error handling for Rate Limits (429) or Quota Exceeded
    const errorMsg = error.message?.toLowerCase() || '';
    const isRateLimit = 
      errorMsg.includes('429') || 
      errorMsg.includes('quota') || 
      errorMsg.includes('exceeded') ||
      error.status === 429 || 
      (error.error && error.error.code === 429) ||
      (error.response && error.response.status === 429);

    if (isRateLimit) {
       console.warn("Gemini AI Quota Exceeded. Using fallback rules.");
    } else {
       console.error("Gemini AI Error (falling back):", error);
    }
    
    // Fallback recommendation logic
    if (sensorData.soilMoisture < 45) {
        return {
            action: 'IRRIGATE',
            title: 'Irrigate Now',
            details: 'Soil moisture is low. Water is needed to maintain crop health.',
            urgency: 'HIGH',
            waterAmount: '15L',
            duration: '20 mins',
            timestamp: Date.now()
        }
    }
    return {
      action: 'WAIT',
      title: 'No Action Needed',
      details: 'Soil conditions are good. Check back tomorrow.',
      urgency: 'LOW',
      timestamp: Date.now()
    };
  }
};

export const getDiseaseRiskAnalysis = async (
  sensorData: SensorData,
  cropType: string
): Promise<{ risk: 'LOW' | 'MEDIUM' | 'HIGH', explanation: string }> => {
  try {
    const prompt = `
      Assess fungal disease risk for ${cropType} based on:
      Temp: ${sensorData.temperature}C, Humidity: ${sensorData.humidity}%.
      Return JSON: { "risk": "LOW"|"MEDIUM"|"HIGH", "explanation": "Max 10 words" }
    `;
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    return JSON.parse(response.text || '{"risk":"LOW", "explanation":"Data unavailable"}');
  } catch (e: any) {
    const errorMsg = e.message?.toLowerCase() || '';
    const isRateLimit = 
      errorMsg.includes('429') || 
      errorMsg.includes('quota') || 
      errorMsg.includes('exceeded') ||
      e.status === 429 || 
      (e.error && e.error.code === 429) ||
      (e.response && e.response.status === 429);

    if (isRateLimit) {
       // Suppress 429 errors from cluttering console
       console.warn("Gemini AI Quota Exceeded for Disease Analysis. Using default.");
    } else {
       console.error("Gemini Disease Analysis Error:", e);
    }
    return { risk: 'LOW', explanation: 'Monitoring conditions.' };
  }
}
