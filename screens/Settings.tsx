
import React, { useRef, useState } from 'react';
import { 
  Download, 
  Upload, 
  Trash2, 
  ChevronRight, 
  ShieldCheck, 
  HelpCircle,
  Bell,
  Database,
  LogOut,
  Star,
  Palette,
  Image as ImageIcon,
  Save
} from 'lucide-react';
import { exportData, importData } from '../store/appStore';
import { User, Branding } from '../types';

interface SettingsScreenProps {
  data: any;
  user: User;
  onLogout: () => void;
  onDataReset: () => void;
  onUpdateBranding: (branding: Branding) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ data, user, onLogout, onDataReset, onUpdateBranding }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const isSuperAdmin = user.id === 'superadmin-001';

  const [brandName, setBrandName] = useState(data.branding.name);
  const [brandLogo, setBrandLogo] = useState(data.branding.logoUrl || '');

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (importData(result)) {
          alert("Data restored successfully!");
          onDataReset();
        } else {
          alert("Invalid backup file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setBrandLogo(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranding = () => {
    onUpdateBranding({
      name: brandName,
      logoUrl: brandLogo
    });
    alert("Branding updated successfully!");
  };

  const handleClear = () => {
    if (confirm("Are you sure? This will delete all your local transactions, goals, and data.")) {
      localStorage.clear();
      onDataReset();
    }
  };

  return (
    <div className="p-6 space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
      </div>

      {/* Profile Card */}
      <div className={`${isSuperAdmin ? 'bg-slate-900 shadow-slate-200' : 'bg-indigo-600 shadow-indigo-100'} rounded-[32px] p-6 text-white shadow-xl flex items-center gap-4 relative overflow-hidden transition-all`}>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <img src={user.avatar} className="w-16 h-16 rounded-2xl border-2 border-white/20 z-10" alt={user.name} />
        <div className="flex-1 z-10">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{user.name}</h3>
            {isSuperAdmin && (
              <div className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter flex items-center gap-0.5">
                <Star size={8} fill="currentColor" /> Admin
              </div>
            )}
          </div>
          <p className={`${isSuperAdmin ? 'text-slate-400' : 'text-indigo-100'} text-sm opacity-80`}>{user.email}</p>
        </div>
        <button onClick={onLogout} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors z-10">
          <LogOut size={20} />
        </button>
      </div>

      {/* Superadmin Branding Section */}
      {isSuperAdmin && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Branding Configuration</h3>
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                <Palette size={24} />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">App Name</label>
                <input 
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. MyMoneyApp"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center shrink-0 cursor-pointer overflow-hidden border-2 border-dashed border-slate-200"
                onClick={() => logoInputRef.current?.click()}
              >
                {brandLogo ? (
                  <img src={brandLogo} className="w-full h-full object-cover" alt="logo" />
                ) : (
                  <ImageIcon size={20} />
                )}
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">App Logo</label>
                <button 
                  onClick={() => logoInputRef.current?.click()}
                  className="text-indigo-600 text-xs font-bold"
                >
                  Upload New Logo
                </button>
                <input 
                  type="file" 
                  ref={logoInputRef} 
                  onChange={handleLogoUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
            </div>

            <button 
              onClick={handleSaveBranding}
              className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-50 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Save size={16} />
              Apply Branding Changes
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Account & Security</h3>
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
          {isSuperAdmin && (
            <button className="w-full p-5 flex items-center justify-between hover:bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-left">
                  <span className="font-bold text-slate-700 block">System Logs</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Superadmin Only</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </button>
          )}
          <button className="w-full p-5 flex items-center justify-between hover:bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Database size={20} />
              </div>
              <span className="font-bold text-slate-700">Privacy & Security</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
          <button className="w-full p-5 flex items-center justify-between hover:bg-slate-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Bell size={20} />
              </div>
              <span className="font-bold text-slate-700">Notifications</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Data Management</h3>
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
          <button 
            onClick={exportData}
            className="w-full p-5 flex items-center justify-between hover:bg-slate-50 border-b border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Download size={20} />
              </div>
              <span className="font-bold text-slate-700">Backup Data (JSON)</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-5 flex items-center justify-between hover:bg-slate-50 border-b border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Upload size={20} />
              </div>
              <span className="font-bold text-slate-700">Restore Backup</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            className="hidden" 
            accept=".json"
          />
          <button 
            onClick={handleClear}
            className="w-full p-5 flex items-center justify-between hover:bg-rose-50 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                <Trash2 size={20} />
              </div>
              <span className="font-bold text-rose-600">Factory Reset</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        </div>
      </div>

      <div className={`${isSuperAdmin ? 'bg-amber-500' : 'bg-slate-900'} rounded-[32px] p-8 text-center space-y-2 relative overflow-hidden transition-colors`}>
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Database size={80} className="text-white" />
        </div>
        <p className={`${isSuperAdmin ? 'text-amber-900' : 'text-indigo-400'} text-[10px] font-bold uppercase tracking-widest`}>
          Version 1.2.0 {isSuperAdmin ? 'Superadmin Active' : 'Dynamic Branding'}
        </p>
        <p className={`${isSuperAdmin ? 'text-amber-950' : 'text-white'} font-bold`}>
          {isSuperAdmin ? 'Enterprise Grade Protection' : 'Pro Experience'}
        </p>
        <p className={`${isSuperAdmin ? 'text-amber-900' : 'text-slate-400'} text-xs px-4`}>
          {isSuperAdmin 
            ? 'You have global visibility of local encrypted databases and can modify application identity.' 
            : 'Cloud sync is currently disabled. All your data is stored securely in your browser\'s local storage.'}
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 text-slate-300 text-xs pb-10">
        <HelpCircle size={14} />
        <span>Contact Support: support@smartfin.ai</span>
      </div>
    </div>
  );
};

export default SettingsScreen;
