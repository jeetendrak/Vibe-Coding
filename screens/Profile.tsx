
import React, { useState, useRef } from 'react';
import { ArrowLeft, User, Phone, Mail, Camera, Save } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileScreenProps {
  user: UserType;
  onUpdate: (user: UserType) => void;
  onBack: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onUpdate, onBack }) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdate({
      ...user,
      name,
      phone,
      avatar
    });
    alert("Profile updated successfully!");
    onBack();
  };

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      <header className="px-6 py-4 flex items-center gap-4 border-b border-slate-100">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
      </header>

      <div className="p-8 flex-1 space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-[40px] bg-slate-100 border-4 border-white shadow-xl overflow-hidden">
              <img 
                src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                className="w-full h-full object-cover" 
                alt="Profile" 
              />
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <Camera size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Profile Picture</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Full Name</label>
            <div className="relative group">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Phone Number</label>
            <div className="relative group">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Email Address</label>
            <div className="relative bg-slate-100/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-400 font-medium">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2" />
              {user.email}
            </div>
            <p className="text-[9px] text-slate-400 ml-2 italic">* Email cannot be changed</p>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 active:scale-95 transition-transform"
        >
          <Save size={20} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;
