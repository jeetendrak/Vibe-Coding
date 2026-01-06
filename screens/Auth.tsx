
import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, TrendingUp, AlertCircle } from 'lucide-react';
import { User, Branding } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  branding: Branding;
}

const Auth: React.FC<AuthProps> = ({ onLogin, branding }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple validation for local-only app
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isLogin && !formData.name) {
      setError("Please enter your name.");
      return;
    }

    // Mock Login: In a real app we'd check a database, 
    // here we just simulate a successful auth and store it locally.
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-8 space-y-12">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-600 rounded-[28px] mx-auto flex items-center justify-center shadow-2xl shadow-indigo-200 animate-bounce overflow-hidden">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} className="w-full h-full object-cover" alt="App Logo" />
            ) : (
              <TrendingUp size={40} className="text-white" />
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{branding.name}</h1>
            <p className="text-slate-400 font-medium text-sm">Personal finance, redefined.</p>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <UserIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  required 
                  placeholder="Full Name" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
            )}

            <div className="relative group">
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                required 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>

            <div className="relative group">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                required 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>
            </div>

            {error && (
              <div className="bg-rose-50 p-3 rounded-xl flex items-center gap-2 text-rose-600 text-[11px] font-bold animate-shake">
                <AlertCircle size={14} />{error}
              </div>
            )}

            <button 
              className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={20} />
            </button>
          </form>

          <div className="relative py-2 text-center">
            <span className="bg-white px-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest relative z-10">Secure Local Vault</span>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-100" />
          </div>
        </div>
      </div>
      <div className="p-8 text-center">
        <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-medium text-slate-400">
          {isLogin ? <>New here? <span className="text-indigo-600 font-bold">Sign up free</span></> : <>Already joined? <span className="text-indigo-600 font-bold">Sign in</span></>}
        </button>
      </div>
    </div>
  );
};

export default Auth;
