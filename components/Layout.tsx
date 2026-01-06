
import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  MessageSquareCode, 
  Target, 
  Settings, 
  TrendingUp,
  Menu,
  X,
  CreditCard,
  PieChart,
  LogOut,
  User as UserIcon
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'DASHBOARD' as AppScreen, label: 'Home', icon: Home },
    { id: 'GROUPS' as AppScreen, label: 'Groups', icon: Users },
    { id: 'SMS_PARSER' as AppScreen, label: 'SmartScan', icon: MessageSquareCode },
    { id: 'GOALS' as AppScreen, label: 'Goals', icon: Target },
    { id: 'SETTINGS' as AppScreen, label: 'More', icon: Settings },
  ];

  const sidebarLinks = [
    { id: 'DASHBOARD' as AppScreen, label: 'Dashboard', icon: Home },
    { id: 'TRANSACTIONS' as AppScreen, label: 'Ledger', icon: CreditCard },
    { id: 'GROUPS' as AppScreen, label: 'Split Groups', icon: Users },
    { id: 'EMI' as AppScreen, label: 'Loans & EMIs', icon: PieChart },
    { id: 'GOALS' as AppScreen, label: 'Savings Goals', icon: Target },
    { id: 'PROFILE' as AppScreen, label: 'My Profile', icon: UserIcon },
    { id: 'SETTINGS' as AppScreen, label: 'Settings', icon: Settings },
  ];

  const handleSidebarNav = (id: AppScreen) => {
    onNavigate(id);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] animate-fadeIn"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`fixed inset-y-0 left-0 w-3/4 max-w-[280px] bg-white z-[110] transform transition-transform duration-300 ease-out shadow-2xl p-6 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-8 pt-safe">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              {branding.logoUrl ? <img src={branding.logoUrl} className="w-full h-full object-cover rounded-lg" /> : <TrendingUp className="text-white w-5 h-5" />}
            </div>
            <span className="font-bold text-slate-900">{branding.name}</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-1">
          {sidebarLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleSidebarNav(link.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${
                activeScreen === link.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </button>
          ))}
        </div>

        <div className="absolute bottom-8 left-6 right-6 pt-6 border-t border-slate-100 pb-safe">
          <button 
            onClick={() => window.location.reload()}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center shrink-0 z-50 pt-safe">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <Menu size={24} />
          </button>
          <button 
            onClick={() => onNavigate('DASHBOARD')}
            className="flex items-center gap-2 active:scale-95 transition-transform"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center overflow-hidden">
              {branding.logoUrl ? (
                <img src={branding.logoUrl} alt="logo" className="w-full h-full object-cover" />
              ) : (
                <TrendingUp className="text-white w-5 h-5" />
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{branding.name}</h1>
          </button>
        </div>
        <button 
          onClick={() => onNavigate('PROFILE')}
          className="transition-transform active:scale-90"
        >
          <img 
            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
            alt={user.name} 
            className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm object-cover"
          />
        </button>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-32">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 flex justify-around items-center py-4 px-2 z-[60] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${
              (activeScreen === item.id || (activeScreen === 'GROUP_DETAIL' && item.id === 'GROUPS')) ? 'text-indigo-600 scale-105' : 'text-slate-400'
            }`}
          >
            <item.icon size={22} strokeWidth={(activeScreen === item.id) ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
