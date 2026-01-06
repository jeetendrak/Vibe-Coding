import React from 'react';
import { ArrowLeft, TrendingUp, Github, Twitter, Mail, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { Branding } from '../types';

interface AboutScreenProps {
  branding: Branding;
  onBack: () => void;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ branding, onBack }) => {
  return (
    <div className="flex flex-col h-full animate-fadeIn bg-slate-50">
      <header className="px-6 py-4 flex items-center gap-4 border-b border-slate-100 bg-white">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-900">About</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-10">
        {/* App Branding Section */}
        <div className="flex flex-col items-center text-center space-y-4 pt-4">
          <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-indigo-100 overflow-hidden">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <TrendingUp size={48} className="text-white" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{branding.name}</h1>
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mt-1">Version 1.0</p>
          </div>
          <p className="text-slate-500 text-sm max-w-[240px] leading-relaxed">
            Your personal finance companion for intelligent budgeting and goal tracking.
          </p>
        </div>

        {/* Developer Credit Section */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Heart size={80} fill="currentColor" className="text-rose-500" />
          </div>
          <div className="space-y-4 relative z-10">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Developer</h3>
            <div className="space-y-1">
              <p className="text-lg font-bold text-slate-900">Jeet</p>
              <p className="text-slate-500 text-sm">Lead Architect & UI Designer</p>
            </div>
            <div className="pt-4 border-t border-slate-50">
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Designed and Developed by <span className="text-indigo-600 font-bold">Jeet</span> with a focus on simplicity, security, and aesthetics.
              </p>
            </div>
          </div>
        </div>

        {/* App Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex flex-col gap-3">
            <ShieldCheck className="text-emerald-600" size={24} />
            <div>
              <p className="text-emerald-900 font-bold text-sm">Secure</p>
              <p className="text-[10px] text-emerald-700/70 font-bold uppercase tracking-wider">Local Vault</p>
            </div>
          </div>
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex flex-col gap-3">
            <TrendingUp className="text-blue-600" size={24} />
            <div>
              <p className="text-blue-900 font-bold text-sm">Insightful</p>
              <p className="text-[10px] text-blue-700/70 font-bold uppercase tracking-wider">AI Powered</p>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="text-center pt-8 pb-10 space-y-4">
           <div className="flex justify-center gap-6">
              <button className="text-slate-300 hover:text-slate-900 transition-colors"><Github size={20}/></button>
              <button className="text-slate-300 hover:text-slate-900 transition-colors"><Twitter size={20}/></button>
              <button className="text-slate-300 hover:text-slate-900 transition-colors"><Mail size={20}/></button>
           </div>
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
             Made in India
           </p>
        </div>
      </div>
    </div>
  );
};

export default AboutScreen;