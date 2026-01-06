
import React from 'react';
import { 
  Home, 
  Users, 
  MessageSquareCode, 
  Target, 
  Settings, 
  TrendingUp
} from 'lucide-react';
import { AppScreen, User, Branding } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  user: User;
  branding: Branding;
}

const Layout: React.FC<LayoutProps> = ({ children, activeScreen, onNavigate, user, branding }) => {
  const navItems = [
    { id: 'DASHBOARD' as AppScreen, label: 'Home', icon: Home },
    { id: 'GROUPS' as AppScreen, label: 'Groups', icon: Users },
    { id: 'SMS_PARSER' as AppScreen, label: 'SmartScan', icon: MessageSquareCode },
    { id: 'GOALS' as AppScreen, label: 'Goals', icon: Target },
    { id: 'SETTINGS' as AppScreen, label: 'More', icon: Settings },
  ];

  const isGroupDetail = activeScreen === 'GROUP_DETAIL';

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center overflow-hidden">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="logo" className="w-full h-full object-cover" />
            ) : (
              <TrendingUp className="text-white w-5 h-5" />
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{branding.name}</h1>
        </div>
        <button 
          onClick={() => onNavigate('SETTINGS')}
          className="transition-transform active:scale-90"
        >
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm"
          />
        </button>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 flex justify-around items-center py-3 px-2 z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              (activeScreen === item.id || (isGroupDetail && item.id === 'GROUPS')) ? 'text-indigo-600 scale-110' : 'text-slate-400'
            }`}
          >
            <item.icon size={22} strokeWidth={(activeScreen === item.id || (isGroupDetail && item.id === 'GROUPS')) ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
