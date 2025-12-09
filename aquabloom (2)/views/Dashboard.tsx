
import React, { useEffect, useState, useRef } from 'react';
import { FarmData, SensorData, AIRecommendation } from '../types';
import { Droplet, Thermometer, Wind, FlaskConical, AlertTriangle, RefreshCw, CheckCircle2, ChevronRight, Activity, CloudSun } from 'lucide-react';
import { getDiseaseRiskAnalysis } from '../services/geminiService';
import { api } from '../services/api';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

interface DashboardProps {
  farm: FarmData;
}

export const Dashboard: React.FC<DashboardProps> = ({ farm }) => {
  const [loading, setLoading] = useState(true);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [diseaseRisk, setDiseaseRisk] = useState<{ risk: string; explanation: string } | null>(null);
  
  const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFetchingAi = useRef<boolean>(false);

  // Initialize last update from localStorage to persist cooldown across refreshes
  const getLastUpdate = () => {
    const stored = localStorage.getItem('last_ai_attempt');
    return stored ? parseInt(stored, 10) : 0;
  };
  
  const setLastUpdate = (timestamp: number) => {
    localStorage.setItem('last_ai_attempt', timestamp.toString());
  };

  const fetchData = async () => {
    try {
      if (!farm.id) return;
      
      // 1. Always fetch high-frequency sensor data
      const data = await api.getLatestSensorData(farm.id);
      setSensorData(data);

      // 2. AI Logic with Persistent Rate Limiting
      const now = Date.now();
      const lastUpdate = getLastUpdate();
      // Wait at least 60 seconds between AI calls
      const cooldownPassed = now - lastUpdate > 60000;
      
      // Only fetch if:
      // a) We are not currently fetching (prevents overlap/race conditions)
      // b) AND (We have no data yet OR cooldown has passed)
      if (!isFetchingAi.current && (!recommendation || cooldownPassed)) {
          isFetchingAi.current = true;
          
          try {
             // Fetch Irrigation Decision
             const rec = await api.getIrrigationDecision(farm.id, data, farm);
             setRecommendation(rec);
             
             // Fetch Disease Risk
             const risk = await getDiseaseRiskAnalysis(data, farm.cropType);
             setDiseaseRisk(risk);
             
             // Update timestamp only on completion
             setLastUpdate(Date.now());
          } catch (aiError) {
             console.warn("AI Update skipped:", aiError);
             // Even on error, update timestamp to prevent immediate retry loop
             setLastUpdate(Date.now()); 
          } finally {
             isFetchingAi.current = false;
          }
      } else if (!recommendation && !isFetchingAi.current) {
        // If we are in cooldown but have NO recommendation (e.g. first load after clear cache but persistent storage has timestamp),
        // we should try to load a fallback without calling the API if possible, or just force the API call if it's been a *very* long time.
        // For now, the loop handles it next time cooldown passes.
      }
    } catch (e) {
      console.error("Sync error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    pollInterval.current = setInterval(fetchData, 5000); // Poll every 5s
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [farm.id]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col h-full bg-surface-subtle pb-28 overflow-y-auto no-scrollbar">
      
      {/* Top Bar / Status Header */}
      <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-1">
          <div>
            <p className="text-text-secondary text-sm font-medium">{getGreeting()}</p>
            <h1 className="text-xl font-bold text-primary">{farm.name}</h1>
          </div>
          <div className="bg-primary-light p-2 rounded-full">
            <CloudSun className="text-primary" size={24} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
           <Badge variant="success" size="sm">System Online</Badge>
           <span className="text-xs text-text-secondary flex items-center gap-1">
             <Activity size={10} /> Updated now
           </span>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 fade-in">
        
        {/* HERO: Smart Action Center */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Recommended Action</h2>
          
          {loading || !recommendation ? (
             <Card className="h-48 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="animate-spin text-secondary" size={32} />
                <p className="text-gray-400 text-sm">Analyzing field data...</p>
             </Card>
          ) : (
            <Card variant={recommendation.action === 'IRRIGATE' ? 'primary' : 'default'} className="relative overflow-hidden">
               {/* Background decoration for visual interest */}
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex gap-3 items-center">
                        <div className={`p-2 rounded-xl ${recommendation.action === 'IRRIGATE' ? 'bg-white/20' : 'bg-primary-light'}`}>
                           {recommendation.action === 'IRRIGATE' ? <Droplet size={24} className="text-white" /> : <CheckCircle2 size={24} className="text-primary" />}
                        </div>
                        <div>
                           <Badge 
                             variant={recommendation.urgency === 'HIGH' ? 'error' : recommendation.urgency === 'MEDIUM' ? 'warning' : 'success'}
                           >
                              {recommendation.urgency} Priority
                           </Badge>
                        </div>
                     </div>
                  </div>

                  <h3 className={`text-2xl font-bold mb-2 ${recommendation.action === 'IRRIGATE' ? 'text-white' : 'text-primary'}`}>
                    {recommendation.title}
                  </h3>
                  <p className={`mb-6 text-sm leading-relaxed ${recommendation.action === 'IRRIGATE' ? 'text-white/90' : 'text-text-secondary'}`}>
                    {recommendation.details}
                  </p>

                  {recommendation.action === 'IRRIGATE' && (
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-xs text-white/70 uppercase mb-1">Water Amount</p>
                        <p className="text-xl font-bold text-white">{recommendation.waterAmount}</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-xs text-white/70 uppercase mb-1">Duration</p>
                        <p className="text-xl font-bold text-white">{recommendation.duration}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                     <Button 
                       fullWidth 
                       variant={recommendation.action === 'IRRIGATE' ? 'white' : 'primary'}
                     >
                       {recommendation.action === 'IRRIGATE' ? 'Start Irrigation' : 'Confirm'}
                     </Button>
                     {recommendation.action === 'IRRIGATE' && (
                       <button className="px-4 text-sm font-semibold text-white/80 hover:text-white">Skip</button>
                     )}
                  </div>
               </div>
            </Card>
          )}
        </div>

        {/* METRICS: Vitals Grid */}
        <div className="space-y-3">
           <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Field Vitals</h2>
           
           {sensorData ? (
             <div className="grid grid-cols-2 gap-3">
               <Card padding="sm" className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                     <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500"><Droplet size={18} /></div>
                     <span className="text-xs text-gray-400">Moisture</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-800">{Math.round(sensorData.soilMoisture)}%</span>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                       <div className="bg-blue-500 h-full rounded-full" style={{ width: `${sensorData.soilMoisture}%` }}></div>
                    </div>
                  </div>
               </Card>

               <Card padding="sm" className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                     <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500"><Thermometer size={18} /></div>
                     <span className="text-xs text-gray-400">Temp</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-800">{sensorData.temperature.toFixed(1)}°</span>
                    <span className="text-xs text-gray-400 ml-1">Celsius</span>
                  </div>
               </Card>

               <Card padding="sm" className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                     <div className="p-1.5 bg-green-50 rounded-lg text-green-500"><Wind size={18} /></div>
                     <span className="text-xs text-gray-400">Humidity</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-800">{Math.round(sensorData.humidity)}%</span>
                    <span className="text-xs text-gray-400 ml-1">RH</span>
                  </div>
               </Card>

               <Card padding="sm" className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                     <div className="p-1.5 bg-purple-50 rounded-lg text-purple-500"><FlaskConical size={18} /></div>
                     <span className="text-xs text-gray-400">Soil pH</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-800">{sensorData.soilPH}</span>
                    <Badge variant="success" size="sm">Optimal</Badge>
                  </div>
               </Card>
             </div>
           ) : (
             <Card className="h-32 flex items-center justify-center text-gray-400 text-sm">
                Syncing sensors...
             </Card>
           )}
        </div>

        {/* ALERTS: Disease Risk */}
        {diseaseRisk && diseaseRisk.risk !== 'LOW' && (
           <Card className="border-l-4 border-l-red-500 flex gap-4 items-start bg-red-50/50">
              <div className="text-red-500 mt-0.5"><AlertTriangle size={20} /></div>
              <div>
                 <h4 className="font-bold text-red-700 text-sm">Disease Risk: {diseaseRisk.risk}</h4>
                 <p className="text-xs text-red-600/80 mt-1">{diseaseRisk.explanation}</p>
              </div>
           </Card>
        )}
      </div>
    </div>
  );
};
