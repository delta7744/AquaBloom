export enum AppView {
  WELCOME = 'WELCOME',
  LOGIN = 'LOGIN',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
  COMMUNITY = 'COMMUNITY',
  SETTINGS = 'SETTINGS'
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'farmer' | 'admin';
  language: 'en' | 'fr' | 'ar';
}

export interface FarmData {
  id?: string;
  ownerId?: string;
  name: string;
  location: string; // GPS string "lat,lng" or City Name
  size: number; // hectares
  cropType: CropType | string;
  plantingDate: string;
}

export interface SensorData {
  soilMoisture: number; // percentage
  temperature: number; // celsius
  humidity: number; // percentage
  soilPH: number;
  timestamp?: number;
}

export interface IrrigationDecision {
  action: 'IRRIGATE' | 'WAIT' | 'MONITOR_DISEASE';
  title: string;
  details: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  waterAmount?: string;
  duration?: string; // minutes
  reason?: string;
  timestamp: number;
}

export interface AIRecommendation extends IrrigationDecision {}

export enum CropType {
  TOMATO = 'Tomato',
  OLIVE = 'Olive',
  STRAWBERRY = 'Strawberry',
  WHEAT = 'Wheat',
  CITRUS = 'Citrus'
}
