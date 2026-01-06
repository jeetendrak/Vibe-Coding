
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const ADMIN_EMAIL = 'jeetendrakulkarni1@gmail.com';
    const ADMIN_PASS = 'Fin@dmin2307';

    setTimeout(() => {
      if (isLogin) {
        if (formData.email === ADMIN_EMAIL) {
          if (formData.password === ADMIN_PASS) {
            onLogin({
              id: 'superadmin-001',
              name: 'Jeetendra',
              email: formData.email,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=jeetendra`
            });
          } else {
            setError("Invalid password for admin account.");
            setIsLoading(false);
            return;
          }
        } else {
          onLogin({
            id: Math.random().toString(36).substr(2, 9),
            name: formData.email.split('@')[0],
            email: formData.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
          });
        }
      } else {
        onLogin({
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name || 'User',
          email: formData.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
        });
      }
      setIsLoading(false);
    }, 1200);
  };

  const handleGoogleSignup = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate real Google data
      const randomSeed = Math.random().toString(36).substring(7);
      onLogin({
        id: `google-${randomSeed}`,
        name: `Google User ${randomSeed.toUpperCase()}`,
        email: `google.${randomSeed}@gmail.com`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`
      });
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-8 space-y-12">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-600 rounded-[28px] mx-auto flex items-center justify-center shadow-2xl shadow-indigo-200 animate-bounce overflow-hidden">
            {branding.logoUrl ? <img src={branding.logoUrl} className="w-full h-full object-cover" /> : <TrendingUp size={40} className="text-white" />}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{branding.name}</h1>
            <p className="text-slate-400 font-medium text-sm">Finances simplified for everyone.</p>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <UserIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input required placeholder="Full Name" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            )}

            <div className="relative group">
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input required type="email" placeholder="Email Address" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="relative group">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input required type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
            </div>

            {error && <div className="bg-rose-50 p-3 rounded-xl flex items-center gap-2 text-rose-600 text-xs font-bold animate-shake"><AlertCircle size={14} />{error}</div>}

            <button disabled={isLoading} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="relative py-2 text-center">
            <span className="bg-white px-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest relative z-10">Or</span>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-100" />
          </div>

          <button onClick={handleGoogleSignup} type="button" className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/></svg>
            Sign up with Google
          </button>
        </div>
      </div>
      <div className="p-8 text-center">
        <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-medium text-slate-400">
          {isLogin ? <>New here? <span className="text-indigo-600 font-bold">Create Account</span></> : <>Already joined? <span className="text-indigo-600 font-bold">Sign in</span></>}
        </button>
      </div>
    </div>
  );
};

export default Auth;
