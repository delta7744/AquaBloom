import React, { useState } from 'react';
import { Button } from '../components/Button';
import { FarmData, CropType } from '../types';
import { MapPin, ArrowRight, Check, Sprout, Ruler } from 'lucide-react';
import { CROP_ICONS } from '../constants';
import { Card } from '../components/Card';

interface OnboardingProps {
  onComplete: (data: FarmData) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FarmData>({
    name: '',
    location: '',
    size: 1,
    cropType: '',
    plantingDate: new Date().toISOString().split('T')[0]
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else onComplete(formData);
  };

  const updateField = (field: keyof FarmData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-surface-subtle p-6 pt-12">
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
         <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i} 
                className={`h-2 w-8 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary' : 'bg-gray-200'}`}
              />
            ))}
         </div>
         <span className="text-sm font-medium text-gray-400">Step {step}/4</span>
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 fade-in">
          {step === 1 && "What is your farm's name?"}
          {step === 2 && "Where is your farm located?"}
          {step === 3 && "What are you growing?"}
          {step === 4 && "How large is the field?"}
        </h1>
        <p className="text-gray-500 mb-8 fade-in">
          {step === 1 && "This helps us personalize your dashboard."}
          {step === 2 && "We use this to pull local weather data."}
          {step === 3 && "Select your primary crop type."}
          {step === 4 && "This helps calculate water saving potential."}
        </p>

        <div className="fade-in">
          {step === 1 && (
            <Card className="shadow-none border-primary/20 ring-4 ring-primary/5">
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Farm Name</label>
              <input 
                type="text"
                autoFocus
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. Green Valley Farm"
                className="w-full text-lg p-2 border-b-2 border-gray-200 focus:border-primary outline-none bg-transparent transition-colors placeholder:text-gray-300"
              />
            </Card>
          )}

          {step === 2 && (
            <div className="space-y-4">
               <Card>
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-primary-light rounded-full text-primary">
                     <MapPin size={20} />
                   </div>
                   <select 
                      className="w-full bg-transparent outline-none text-lg py-2"
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                    >
                      <option value="" disabled>Select Region</option>
                      <option value="Tunis">Tunis</option>
                      <option value="Sousse">Sousse</option>
                      <option value="Sfax">Sfax</option>
                      <option value="Nabeul">Nabeul</option>
                      <option value="Bizerte">Bizerte</option>
                      <option value="Monastir">Monastir</option>
                   </select>
                 </div>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-4">
              {Object.values(CropType).map((crop) => (
                <Card 
                  key={crop}
                  padding="lg"
                  variant={formData.cropType === crop ? 'primary' : 'default'}
                  onClick={() => updateField('cropType', crop)}
                  className="flex flex-col items-center gap-3 relative overflow-hidden group"
                >
                  <span className="text-4xl transform group-hover:scale-110 transition-transform">{CROP_ICONS[crop]}</span>
                  <span className={`font-semibold ${formData.cropType === crop ? 'text-white' : 'text-gray-700'}`}>{crop}</span>
                  {formData.cropType === crop && (
                    <div className="absolute top-3 right-3 text-white"><Check size={16} /></div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {step === 4 && (
            <Card className="flex flex-col items-center py-10">
              <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center text-primary mb-6">
                <Ruler size={32} />
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {formData.size} <span className="text-2xl font-normal text-gray-400">ha</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="50" 
                step="0.5"
                value={formData.size}
                onChange={(e) => updateField('size', parseFloat(e.target.value))}
                className="w-full max-w-xs h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-8"
              />
            </Card>
          )}
        </div>
      </div>

      <Button 
        fullWidth 
        onClick={handleNext}
        disabled={
          (step === 1 && !formData.name) || 
          (step === 2 && !formData.location) ||
          (step === 3 && !formData.cropType)
        }
      >
        {step === 4 ? "Complete Setup" : "Continue"}
        {step !== 4 && <ArrowRight size={20} />}
      </Button>
    </div>
  );
};