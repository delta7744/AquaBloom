import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import { CHART_DATA } from '../constants';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { TrendingUp, Droplet } from 'lucide-react';

export const History: React.FC = () => {
  return (
    <div className="p-6 pb-28 h-full bg-surface-subtle overflow-y-auto no-scrollbar">
       <div className="flex justify-between items-end mb-6">
          <h1 className="text-2xl font-bold text-primary">Insights</h1>
          <select className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-primary">
            <option>Last 7 Days</option>
            <option>Last Month</option>
            <option>Season</option>
          </select>
       </div>
       
       {/* Primary Impact Card */}
       <Card variant="primary" className="mb-6 relative overflow-hidden">
          <div className="relative z-10">
             <div className="flex items-center gap-2 text-white/80 mb-2">
                <TrendingUp size={16} />
                <span className="text-sm font-medium">Impact This Month</span>
             </div>
             <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-1">324 L</h2>
                  <p className="text-white/70 text-sm">Water Saved</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-white mb-1">45 TND</h2>
                  <p className="text-white/70 text-sm">Est. Money Saved</p>
                </div>
             </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
       </Card>

       <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Water Consumption</h3>
            <Card className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#006D77" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#006D77" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    cursor={{ stroke: '#CBD5E1' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="usage" 
                    stroke="#006D77" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorUsage)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div>
             <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Recent Activity</h3>
             <div className="space-y-3">
                <Card padding="sm" className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                         <Droplet size={20} />
                      </div>
                      <div>
                         <p className="font-semibold text-sm">Irrigation Completed</p>
                         <p className="text-xs text-gray-400">Today, 06:00 AM</p>
                      </div>
                   </div>
                   <span className="font-bold text-sm text-gray-700">120 L</span>
                </Card>
                
                <Card padding="sm" className="flex items-center justify-between opacity-60">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                         <Droplet size={20} />
                      </div>
                      <div>
                         <p className="font-semibold text-sm">System Check</p>
                         <p className="text-xs text-gray-400">Yesterday, 8:00 PM</p>
                      </div>
                   </div>
                   <Badge variant="neutral" size="sm">Auto</Badge>
                </Card>
             </div>
          </div>
       </div>
    </div>
  );
};