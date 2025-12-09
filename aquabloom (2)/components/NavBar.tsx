import React from 'react';
import { Home, BarChart3, Users, Settings } from 'lucide-react';
import { AppView } from '../types';

interface NavBarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { view: AppView.DASHBOARD, icon: Home, label: 'Dashboard' },
    { view: AppView.HISTORY, icon: BarChart3, label: 'Insights' },
    { view: AppView.COMMUNITY, icon: Users, label: 'Community' },
    { view: AppView.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe pt-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto pb-6 pt-3 px-2">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all duration-300 w-20 group relative`}
            >
              <div className={`
                 p-1.5 rounded-xl transition-all duration-300
                 ${isActive ? 'bg-primary-light text-primary translate-y-0' : 'text-gray-400 group-hover:bg-gray-50'}
              `}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};