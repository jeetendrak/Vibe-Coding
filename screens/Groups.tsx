
import React, { useState } from 'react';
import { Users, Plus, ChevronRight, Share2, TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import { Group, GroupMember, AppScreen } from '../types';

interface GroupsScreenProps {
  groups: Group[];
  onSelectGroup: (group: Group) => void;
  onCreateGroup: (group: Group) => void;
}

const GroupsScreen: React.FC<GroupsScreenProps> = ({ groups, onSelectGroup, onCreateGroup }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = () => {
    if (!newName) return;
    const newGroup: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      description: newDesc,
      inviteCode: `SMART-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      members: [{ id: 'u1', name: 'You', contact: 'me@smartfin.com', isUser: true }],
      transactions: []
    };
    onCreateGroup(newGroup);
    setIsAdding(false);
    setNewName('');
    setNewDesc('');
  };

  const calculateGroupBalance = (group: Group) => {
    let userBalance = 0;
    group.transactions.forEach(t => {
      const perPerson = t.amount / t.splitBetweenIds.length;
      if (t.paidById === 'u1') {
        // User paid, others owe user
        const othersShare = t.amount - (t.splitBetweenIds.includes('u1') ? perPerson : 0);
        userBalance += othersShare;
      } else if (t.splitBetweenIds.includes('u1')) {
        // User is in split but didn't pay
        userBalance -= perPerson;
      }
    });
    return userBalance;
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Groups</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {groups.length > 0 ? groups.map(group => {
          const balance = calculateGroupBalance(group);
          return (
            <button 
              key={group.id}
              onClick={() => onSelectGroup(group)}
              className="w-full bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Users size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{group.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{group.members.length} Members</p>
                </div>
              </div>
              
              <div className="text-right">
                {balance === 0 ? (
                  <p className="text-xs font-bold text-slate-400 uppercase">Settled</p>
                ) : (
                  <div className="flex flex-col items-end">
                    <p className={`text-sm font-black ${balance > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {balance > 0 ? '+' : ''}₹{Math.abs(balance).toLocaleString()}
                    </p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">
                      {balance > 0 ? 'You are owed' : 'You owe'}
                    </p>
                  </div>
                )}
              </div>
            </button>
          );
        }) : (
          <div className="py-20 flex flex-col items-center text-slate-300">
            <Users size={64} className="opacity-20 mb-4" />
            <p className="font-medium text-slate-400">No groups found</p>
            <p className="text-xs text-slate-400">Create a group to start splitting bills</p>
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-slideUp">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
            <h3 className="text-xl font-bold text-slate-900 mb-6">Create New Group</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Group Name</label>
                <input 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Goa Trip, Flat Rent"
                  className="w-full bg-slate-50 p-4 rounded-2xl text-slate-800 outline-none border border-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Description</label>
                <input 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What is this group for?"
                  className="w-full bg-slate-50 p-4 rounded-2xl text-slate-800 outline-none border border-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsAdding(false)} className="flex-1 py-4 text-slate-400 font-bold">Cancel</button>
                <button onClick={handleCreate} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsScreen;
