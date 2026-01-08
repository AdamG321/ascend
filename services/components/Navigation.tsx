
import React from 'react';

interface NavigationProps {
  activeTab: 'home' | 'aura' | 'tree' | 'stats';
  setActiveTab: (tab: 'home' | 'aura' | 'tree' | 'stats') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: 'fa-house-chimney', label: 'Home' },
    { id: 'tree', icon: 'fa-tree', label: 'The Grove' },
    { id: 'aura', icon: 'fa-ghost', label: 'Aura' },
    { id: 'stats', icon: 'fa-chart-line', label: 'Stats' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 pb-safe-area-inset-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 w-full ${
              activeTab === tab.id ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className={`text-xl ${activeTab === tab.id ? 'scale-110' : 'scale-100'}`}>
              <i className={`fa-solid ${tab.icon}`}></i>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
