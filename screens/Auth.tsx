
import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider } from '../services/firebaseService';
import { User, Branding } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  branding: Branding;
}

const Auth: React.FC<AuthProps> = ({ onLogin, branding }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleFirebaseError = (error: any) => {
    console.error("Auth error:", error);
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return "Invalid email or password.";
      case 'auth/email-already-in-use':
        return "This email is already registered.";
      case 'auth/weak-password':
        return "Password should be at least 6 characters.";
      case 'auth/popup-closed-by-user':
        return "Sign-in cancelled.";
      default:
        return "An authentication error occurred. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        onLogin({
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
        });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        
        // Update display name if provided
        if (formData.name) {
          await updateProfile(user, { displayName: formData.name });
        }

        onLogin({
          id: user.uid,
          name: formData.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
        });
      }
    } catch (err: any) {
      setError(handleFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onLogin({
        id: user.uid,
        name: user.displayName || 'Google User',
        email: user.email || '',
        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`
      });
    } catch (err: any) {
      setError(handleFirebaseError(err));
    } finally {
      setIsGoogleLoading(false);
    }
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

            {error && (
              <div className="bg-rose-50 p-3 rounded-xl flex items-center gap-2 text-rose-600 text-[11px] font-bold animate-shake">
                <AlertCircle size={14} />{error}
              </div>
            )}

            <button 
              disabled={isLoading || isGoogleLoading} 
              className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="relative py-2 text-center">
            <span className="bg-white px-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest relative z-10">Or Continue With</span>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-100" />
          </div>

          <button 
            onClick={handleGoogleAuth} 
            disabled={isLoading || isGoogleLoading}
            type="button" 
            className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-sm disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <Loader2 className="animate-spin text-indigo-600" size={20} />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/></svg>
                Sign in with Google
              </>
            )}
          </button>
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
