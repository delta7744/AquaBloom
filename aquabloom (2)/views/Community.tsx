
import React from 'react';
import { COMMUNITY_TIPS } from '../constants';
import { ThumbsUp, MessageCircle, Trophy } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

export const Community: React.FC = () => {
  return (
    <div className="p-6 pb-24 h-full bg-surface-subtle overflow-y-auto no-scrollbar">
      <h1 className="text-2xl font-bold text-primary mb-6">Farmer Community</h1>

      {/* Top Saver Card - Updated to light theme with black text */}
      <Card className="mb-8 relative overflow-hidden bg-white border-primary/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light rounded-full -mr-10 -mt-10 opacity-50" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
               <Trophy size={20} />
            </div>
            <h2 className="text-xl font-bold text-primary">Top Saver!</h2>
          </div>
          
          {/* Paragraph updated to black as requested */}
          <p className="text-black font-medium mb-4 leading-relaxed">
            You save more water than 78% of farmers in Monastir region.
          </p>
          
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
             <div className="bg-secondary h-full rounded-full w-[78%] shadow-sm"></div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right">Top 22%</p>
        </div>
      </Card>

      <h3 className="font-bold text-primary text-lg mb-4 flex items-center gap-2">
        Tips from Neighbors
        <Badge variant="neutral" size="sm">{COMMUNITY_TIPS.length}</Badge>
      </h3>
      
      <div className="space-y-4">
        {COMMUNITY_TIPS.map((tip) => (
          <Card key={tip.id} padding="md" className="border-l-4 border-l-secondary">
             <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-xs font-bold text-primary">
                  {tip.author[0]}
                </div>
                <div>
                   <span className="font-bold text-sm text-gray-900 block">{tip.author}</span>
                   <span className="text-[10px] text-gray-400">Verified Farmer</span>
                </div>
             </div>
             <p className="text-gray-700 mb-4 text-sm leading-relaxed">{tip.text}</p>
             <div className="flex gap-4 text-gray-400 text-sm">
                <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                   <ThumbsUp size={16} /> <span className="text-xs font-medium">{tip.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                   <MessageCircle size={16} /> <span className="text-xs font-medium">Reply</span>
                </button>
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
