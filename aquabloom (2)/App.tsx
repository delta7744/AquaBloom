import React, { useState, useEffect } from 'react';
import { AppView, FarmData } from './types';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { History } from './views/History';
import { Community } from './views/Community';
import { NavBar } from './components/NavBar';
import { Button } from './components/Button';
import { Sprout, Loader2 } from 'lucide-react';
import { api } from './services/api';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.WELCOME);
  const [farmData, setFarmData] = useState<FarmData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      const farm = await api.getMyFarm();
      if (farm) {
        setFarmData(farm);
        // Only skip to dashboard if we found a farm, otherwise stay on welcome
        // But for UX, let's let the user click "Get Started" or "Login"
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    await api.login("+21612345678"); // Mock login
    const farm = await api.getMyFarm();
    setIsLoading(false);
    
    if (farm) {
      setFarmData(farm);
      setCurrentView(AppView.DASHBOARD);
    } else {
      setCurrentView(AppView.ONBOARDING);
    }
  };

  const handleOnboardingComplete = async (data: FarmData) => {
    setIsLoading(true);
    // Ensure we are logged in implicitly for the demo
    await api.login("+21612345678"); 
    const createdFarm = await api.createFarm(data);
    setFarmData(createdFarm);
    setIsLoading(false);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = async () => {
    await api.logout();
    setFarmData(null);
    setCurrentView(AppView.WELCOME);
  };

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="h-full flex flex-col items-center justify-center bg-softCream">
          <Loader2 className="animate-spin text-deepTeal" size={48} />
          <p className="mt-4 text-gray-500 font-medium">Connecting to AquaBloom Cloud...</p>
        </div>
      );
    }

    switch (currentView) {
      case AppView.WELCOME:
        return (
          <div className="h-full flex flex-col justify-center items-center p-8 bg-deepTeal text-white text-center relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-sageGreen rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-waterBlue rounded-full opacity-10 blur-3xl"></div>
            
            <div className="mb-8 p-6 bg-white/10 rounded-full backdrop-blur-sm">
              <Sprout size={64} className="text-sageGreen" />
            </div>
            <h1 className="text-4xl font-bold mb-2">AquaBloom</h1>
            <p className="text-xl text-sageGreen mb-12">Smart Water. Better Crops.</p>
            
            <div className="w-full space-y-4 max-w-sm z-10">
              <Button fullWidth onClick={() => setCurrentView(AppView.ONBOARDING)} className="bg-sageGreen text-deepTeal">
                Get Started
              </Button>
              <Button fullWidth variant="ghost" onClick={handleLogin} className="text-sageGreen hover:bg-white/10">
                I already have an account
              </Button>
            </div>
          </div>
        );
        
      case AppView.LOGIN:
         return (
            <div className="h-full flex flex-col p-8 bg-softCream">
               <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold text-deepTeal mb-6">Welcome Back</h2>
                  <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
                     <div>
                        <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
                        <input type="tel" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" placeholder="+216" defaultValue="+216 " />
                     </div>
                     <Button fullWidth onClick={handleLogin}>Login</Button>
                  </div>
                  <Button variant="ghost" className="mt-4" onClick={() => setCurrentView(AppView.WELCOME)}>Back</Button>
               </div>
            </div>
         );

      case AppView.ONBOARDING:
        return <Onboarding onComplete={handleOnboardingComplete} />;
        
      case AppView.DASHBOARD:
        return farmData ? <Dashboard farm={farmData} /> : <div />;
        
      case AppView.HISTORY:
        return <History />;
        
      case AppView.COMMUNITY:
        return <Community />;
        
      case AppView.SETTINGS:
        return (
            <div className="p-6 h-full bg-softCream">
                <h1 className="text-2xl font-bold text-deepTeal mb-6">Settings</h1>
                
                <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">👤</div>
                    <div>
                      <h3 className="font-bold">Ahmed Ben Ali</h3>
                      <p className="text-xs text-gray-500">+216 55 123 456</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-gray-500">Language</p>
                    <div className="flex gap-2 mt-2">
                        <button className="px-4 py-2 bg-deepTeal text-white rounded-lg text-sm">English</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">Français</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">Darija</button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm mt-4">
                  <p className="text-gray-500 mb-2">System Status</p>
                  <div className="flex items-center justify-between text-sm">
                     <span>Backend</span>
                     <span className="text-healthyGreen flex items-center gap-1">● Online (Simulated)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                     <span>IoT Sensors</span>
                     <span className="text-healthyGreen flex items-center gap-1">● Connected</span>
                  </div>
                </div>

                <div className="mt-8">
                    <Button variant="outline" fullWidth onClick={handleLogout}>Log Out</Button>
                </div>
            </div>
        );

      default:
        return <div>View not found</div>;
    }
  };

  const showNavBar = [AppView.DASHBOARD, AppView.HISTORY, AppView.COMMUNITY, AppView.SETTINGS].includes(currentView);

  return (
    <div className="h-screen w-full mx-auto max-w-md bg-white shadow-2xl relative overflow-hidden font-sans">
      {renderView()}
      {showNavBar && (
        <NavBar currentView={currentView} onChangeView={setCurrentView} />
      )}
    </div>
  );
};

export default App;
