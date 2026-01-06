
import React, { useRef, useState } from 'react';
import { 
  Download, 
  Trash2, 
  ChevronRight, 
  ShieldCheck, 
  Bell, 
  LogOut, 
  Star, 
  Image as ImageIcon, 
  Save, 
  RotateCcw, 
  Fingerprint, 
  Lock, 
  MessageCircle,
  Layout as BrandingIcon
} from 'lucide-react';
import { exportData } from '../store/appStore';
import { User, Branding } from '../types';

interface SettingsScreenProps {
  data: any;
  user: User;
  onLogout: () => void;
  onDataReset: () => void;
  onUpdateBranding: (branding: Branding) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ data, user, onLogout, onDataReset, onUpdateBranding }) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const isSuperAdmin = user.id === 'superadmin-001';

  const [brandName, setBrandName] = useState(data.branding.name);
  const [brandLogo, setBrandLogo] = useState(data.branding.logoUrl || '');
  const [activeTab, setActiveTab] = useState<'MAIN' | 'PRIVACY' | 'NOTIFICATIONS' | 'BRANDING'>('MAIN');

  // Privacy/Notification Mock States
  const [isBioLockEnabled, setIsBioLockEnabled] = useState(false);
  const [isTxAlerts, setIsTxAlerts] = useState(true);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setBrandLogo(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranding = () => {
    onUpdateBranding({ name: brandName, logoUrl: brandLogo });
    alert("Branding updated successfully!");
    setActiveTab('MAIN');
  };

  const handleResetBranding = () => {
    if (confirm("Reset branding to defaults?")) {
      setBrandName('SmartFin');
      setBrandLogo('');
      onUpdateBranding({ name: 'SmartFin', logoUrl: '' });
      alert("Branding reset to defaults.");
      setActiveTab('MAIN');
    }
  };

  if (activeTab === 'BRANDING') {
    return (
      <div className="p-6 space-y-6 animate-fadeIn">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('MAIN')} className="p-2 -ml-2 text-slate-400">
            <RotateCcw size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-900">App Branding</h2>
        </div>
        
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 bg-slate-50 border-2 border-slate-100 rounded-[28px] flex items-center justify-center overflow-hidden">
                {brandLogo ? (
                  <img src={brandLogo} className="w-full h-full object-cover" alt="Custom Logo" />
                ) : (
                  <ImageIcon size={32} className="text-slate-200" />
                )}
              </div>
              <button 
                onClick={() => logoInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <ImageIcon size={18} />
              </button>
              <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">App Icon</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">App Name</label>
            <input 
              value={brandName} 
              onChange={(e) => setBrandName(e.target.value)} 
              placeholder="e.g. MyExpenseTracker"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 font-bold text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={handleResetBranding} 
              className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
            >
              Reset
            </button>
            <button 
              onClick={handleSaveBranding} 
              className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Save size={18} /> Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'PRIVACY') {
    return (
      <div className="p-6 space-y-6 animate-fadeIn">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('MAIN')} className="p-2 -ml-2 text-slate-400">
            <RotateCcw size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-900">Privacy & Security</h2>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-6 flex items-center justify-between border-b border-slate-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Fingerprint size={20} /></div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Biometric Lock</p>
                <p className="text-[10px] text-slate-400">Fingerprint/FaceID on open</p>
              </div>
            </div>
            <button 
              onClick={() => setIsBioLockEnabled(!isBioLockEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isBioLockEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isBioLockEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Lock size={20} /></div>
              <div>
                <p className="font-bold text-slate-800 text-sm">On-Device Encryption</p>
                <p className="text-[10px] text-slate-400">Data never leaves your phone</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-emerald-600 uppercase">Active</span>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'NOTIFICATIONS') {
    return (
      <div className="p-6 space-y-6 animate-fadeIn">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('MAIN')} className="p-2 -ml-2 text-slate-400">
            <RotateCcw size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><MessageCircle size={20} /></div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Transaction Alerts</p>
                <p className="text-[10px] text-slate-400">Instant spending alerts</p>
              </div>
            </div>
            <button 
              onClick={() => setIsTxAlerts(!isTxAlerts)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isTxAlerts ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isTxAlerts ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
      </div>

      {/* User Card */}
      <div className={`${isSuperAdmin ? 'bg-slate-900 shadow-slate-200' : 'bg-indigo-600 shadow-indigo-100'} rounded-[32px] p-6 text-white shadow-xl flex items-center gap-4 relative overflow-hidden transition-all active:scale-[0.98]`}>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} className="w-16 h-16 rounded-2xl border-2 border-white/20 z-10 object-cover" alt={user.name} />
        <div className="flex-1 z-10">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{user.name}</h3>
            {isSuperAdmin && <div className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full text-[8px] font-black uppercase flex items-center gap-0.5"><Star size={8} fill="currentColor" /> Admin</div>}
          </div>
          <p className="text-indigo-100 text-sm opacity-80">{user.email}</p>
        </div>
        <button onClick={onLogout} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors z-10"><LogOut size={20} /></button>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">App Customization</h3>
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
          <button onClick={() => setActiveTab('BRANDING')} className="w-full p-5 flex items-center justify-between hover:bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><BrandingIcon size={20} /></div>
              <span className="font-bold text-slate-700">App Name & Logo</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Preferences</h3>
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
          <button onClick={() => setActiveTab('PRIVACY')} className="w-full p-5 flex items-center justify-between hover:bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><ShieldCheck size={20} /></div>
              <span className="font-bold text-slate-700">Privacy & Security</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
          <button onClick={() => setActiveTab('NOTIFICATIONS')} className="w-full p-5 flex items-center justify-between hover:bg-slate-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Bell size={20} /></div>
              <span className="font-bold text-slate-700">Notifications</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Data Management</h3>
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
          <button onClick={exportData} className="w-full p-5 flex items-center justify-between hover:bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Download size={20} /></div>
              <span className="font-bold text-slate-700">Export Backup</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
          <button onClick={onDataReset} className="w-full p-5 flex items-center justify-between hover:bg-rose-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center"><Trash2 size={20} /></div>
              <span className="font-bold text-rose-600">Factory Reset App</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        </div>
      </div>

      <p className="text-center text-slate-300 text-[10px] font-bold pb-10 uppercase tracking-widest">Version 2.0.0 • Professional Build</p>
    </div>
  );
};

export default SettingsScreen;
