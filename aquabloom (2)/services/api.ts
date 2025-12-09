import { User, FarmData, SensorData, IrrigationDecision, CropType } from '../types';
import { getIrrigationRecommendation, getDiseaseRiskAnalysis } from './geminiService';
import { MOCK_SENSOR_DATA } from '../constants';

// SIMULATION CONFIG
const SIMULATE_NETWORK_DELAY = 600;
const USE_MOCK_BACKEND = true; // In a real app, check process.env.NODE_ENV

class ApiService {
  private user: User | null = null;
  private currentFarm: FarmData | null = null;

  // --- AUTHENTICATION ---
  
  async login(phone: string): Promise<User> {
    await this.delay();
    // Simulate backend response
    const mockUser: User = {
      id: 'usr_123',
      name: 'Ahmed Ben Ali',
      phone: phone,
      role: 'farmer',
      language: 'en'
    };
    this.user = mockUser;
    localStorage.setItem('ab_user', JSON.stringify(mockUser));
    return mockUser;
  }

  async logout(): Promise<void> {
    this.user = null;
    this.currentFarm = null;
    localStorage.removeItem('ab_user');
    localStorage.removeItem('ab_farm');
  }

  // --- FARM MANAGEMENT ---

  async createFarm(data: FarmData): Promise<FarmData> {
    await this.delay();
    const newFarm = { ...data, id: 'frm_' + Date.now(), ownerId: this.user?.id };
    this.currentFarm = newFarm;
    localStorage.setItem('ab_farm', JSON.stringify(newFarm));
    return newFarm;
  }

  async getMyFarm(): Promise<FarmData | null> {
    await this.delay();
    // Try to recover from local storage for demo persistence
    const stored = localStorage.getItem('ab_farm');
    if (stored) {
      this.currentFarm = JSON.parse(stored);
      return this.currentFarm;
    }
    return null;
  }

  // --- IOT & SENSORS ---

  // Simulates getting the latest reading from MongoDB/MQTT buffer
  async getLatestSensorData(farmId: string): Promise<SensorData> {
    await this.delay(300);
    // Return mock data with slight random variations to look "live"
    return {
      soilMoisture: Math.max(0, Math.min(100, MOCK_SENSOR_DATA.soilMoisture + (Math.random() * 6 - 3))),
      temperature: MOCK_SENSOR_DATA.temperature + (Math.random() * 2 - 1),
      humidity: MOCK_SENSOR_DATA.humidity + (Math.random() * 4 - 2),
      soilPH: 6.8,
      timestamp: Date.now()
    };
  }

  // --- DECISION ENGINE ---
  
  // This mirrors the backend endpoint GET /decisions/latest/:farmId
  async getIrrigationDecision(farmId: string, sensorData: SensorData, farmData: FarmData): Promise<IrrigationDecision> {
    // In a real app, this would just be: return http.get(`/decisions/latest/${farmId}`);
    // Here we simulate the Backend + AI Logic
    
    // 1. Try to use Gemini (Simulating the backend's AI Integration)
    try {
      const aiRec = await getIrrigationRecommendation(sensorData, farmData);
      return {
        ...aiRec,
        timestamp: Date.now()
      };
    } catch (e) {
      // Fallback Rule Engine (Simulating backend/irrigation.js)
      return this.fallbackRuleEngine(sensorData, farmData);
    }
  }

  private fallbackRuleEngine(data: SensorData, farm: FarmData): IrrigationDecision {
    if (data.soilMoisture < 40) {
      return {
        action: 'IRRIGATE',
        title: 'Water Needed',
        details: 'Moisture levels are critical.',
        urgency: 'HIGH',
        waterAmount: '20L',
        duration: '25 min',
        timestamp: Date.now()
      };
    }
    return {
      action: 'WAIT',
      title: 'All Good',
      details: 'Conditions are optimal.',
      urgency: 'LOW',
      timestamp: Date.now()
    };
  }

  // --- ANALYTICS ---
  async getWaterSavings(farmId: string): Promise<{ savedLiters: number, comparisonPct: number }> {
    await this.delay();
    return { savedLiters: 324, comparisonPct: 12 };
  }

  private delay(ms = SIMULATE_NETWORK_DELAY) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const api = new ApiService();
