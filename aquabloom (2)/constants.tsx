import React from 'react';
import { SensorData, CropType } from './types';

export const MOCK_SENSOR_DATA: SensorData = {
  soilMoisture: 42,
  temperature: 28,
  humidity: 62,
  soilPH: 6.8
};

export const CROP_ICONS: Record<CropType, string> = {
  [CropType.TOMATO]: '🍅',
  [CropType.OLIVE]: '🫒',
  [CropType.STRAWBERRY]: '🍓',
  [CropType.WHEAT]: '🌾',
  [CropType.CITRUS]: '🍋',
};

export const CHART_DATA = [
  { day: 'Mon', usage: 120, baseline: 150 },
  { day: 'Tue', usage: 132, baseline: 160 },
  { day: 'Wed', usage: 101, baseline: 150 },
  { day: 'Thu', usage: 134, baseline: 170 },
  { day: 'Fri', usage: 90, baseline: 140 },
  { day: 'Sat', usage: 230, baseline: 250 },
  { day: 'Sun', usage: 210, baseline: 240 },
];

export const COMMUNITY_TIPS = [
  {
    id: 1,
    author: "Ahmed from Sousse",
    text: "Irrigating at 5 AM reduced my water usage by 15%.",
    likes: 24
  },
  {
    id: 2,
    author: "Fatima from Nabeul",
    text: "Mulching around my strawberries kept the soil moist for 2 extra days.",
    likes: 45
  }
];