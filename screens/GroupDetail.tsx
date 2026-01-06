
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Share2, 
  Users, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  X,
  CreditCard,
  UserPlus
} from 'lucide-react';
import { Group, GroupMember, GroupTransaction, AppScreen } from '../types';

interface GroupDetailProps {
  group: Group;
  onBack: () => void;
  onUpdateGroup: (group: Group) => void;
}

const GroupDetail: React.FC<GroupDetailProps> = ({ group, onBack, onUpdateGroup }) => {
  const [tab, setTab] = useState<'EXPENSES' | 'BALANCES'>('EXPENSES');
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);

  // New Expense State
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('u1');
  const [splitWith, setSplitWith] = useState<string[]>(group.members.map(m => m.id));

  // New Member State
  const [memName, setMemName] = useState('');
  const [memContact, setMemContact] = useState('');

  const handleAddExpense = () => {
    if (!desc || !amount || splitWith.length === 0) return;
    const newTx: GroupTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      groupId: group.id,
      description: desc,
      amount: parseFloat(amount),
      paidById: paidBy,
      splitBetweenIds: splitWith,
      date: new Date().toISOString(),
      category: 'Other'
    };
    onUpdateGroup({ ...group, transactions: [newTx, ...group.transactions] });
    setIsAddingExpense(false);
    setDesc('');
    setAmount('');
  };

  const handleAddMember = () => {
    if (!memName) return;
    const newMember: GroupMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: memName,
      contact: memContact,
      isUser: false
    };
    onUpdateGroup({ ...group, members: [...group.members, newMember] });
    setIsAddingMember(false);
    setMemName('');
    setMemContact('');
  };

  const calculateMemberBalances = () => {
    const balances: Record<string, number> = {};
    group.members.forEach(m => balances[m.id] = 0);

    group.transactions.forEach(t => {
      const perPerson = t.amount / t.splitBetweenIds.length;
      // Subtract what everyone owes
      t.splitBetweenIds.forEach(id => {
        balances[id] -= perPerson;
      });
      // Add back what the payer paid
      balances[t.paidById] += t.amount;
    });
    return balances;
  };

  const memberBalances = calculateMemberBalances();

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800">{group.name}</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{group.members.length} Members</p>
        </div>
        <button 
          onClick={() => {
            const link = `https://smartfin.app/join?code=${group.inviteCode}`;
            navigator.clipboard.writeText(link);
            alert("Invite link copied to clipboard!");
          }}
          className="p-2 text-indigo-600 bg-indigo-50 rounded-xl"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white px-6 py-2 border-b border-slate-100 gap-6">
        <button 
          onClick={() => setTab('EXPENSES')}
          className={`pb-2 text-sm font-bold transition-all ${tab === 'EXPENSES' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}
        >
          Expenses
        </button>
        <button 
          onClick={() => setTab('BALANCES')}
          className={`pb-2 text-sm font-bold transition-all ${tab === 'BALANCES' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}
        >
          Balances
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-4">
        {tab === 'EXPENSES' ? (
          <>
            {group.transactions.length > 0 ? group.transactions.map(t => (
              <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{t.description}</p>
                    <p className="text-[10px] text-slate-400">
                      Paid by <span className="text-indigo-600 font-bold">{group.members.find(m => m.id === t.paidById)?.name}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-800">₹{t.amount.toLocaleString()}</p>
                  <p className="text-[8px] text-slate-400 uppercase font-bold">{new Date(t.date).toLocaleDateString()}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 text-slate-300">
                <CreditCard size={48} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">No shared expenses yet</p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Balances</h4>
              <button onClick={() => setIsAddingMember(true)} className="text-indigo-600 text-xs font-bold flex items-center gap-1">
                <UserPlus size={14} /> Add Member
              </button>
            </div>
            {group.members.map(member => {
              const bal = memberBalances[member.id];
              return (
                <div key={member.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${member.isUser ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{member.name} {member.isUser && '(You)'}</p>
                      <p className="text-[10px] text-slate-400">{member.contact || 'No contact info'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {bal === 0 ? (
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Settled</p>
                    ) : (
                      <div className="flex flex-col items-end">
                        <p className={`text-sm font-black ${bal > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {bal > 0 ? '+' : ''}₹{Math.abs(bal).toLocaleString()}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">
                          {bal > 0 ? 'Owed to them' : 'They owe'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {tab === 'EXPENSES' && (
        <button 
          onClick={() => setIsAddingExpense(true)}
          className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-100 flex items-center justify-center active:scale-95 transition-transform z-50"
        >
          <Plus size={28} />
        </button>
      )}

      {/* Add Expense Modal */}
      {isAddingExpense && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-slideUp">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
            <h3 className="text-xl font-bold text-slate-900 mb-6">Split Expense</h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <input 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Description"
                className="w-full bg-slate-50 p-4 rounded-2xl text-slate-800 outline-none border border-slate-100"
              />
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 p-4 pl-8 rounded-2xl text-slate-800 outline-none border border-slate-100"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase ml-2">Paid By</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {group.members.map(m => (
                    <button 
                      key={m.id}
                      onClick={() => setPaidBy(m.id)}
                      className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${paidBy === m.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-100'}`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase ml-2">Split Between</p>
                <div className="grid grid-cols-2 gap-2">
                  {group.members.map(m => (
                    <button 
                      key={m.id}
                      onClick={() => {
                        setSplitWith(prev => 
                          prev.includes(m.id) ? prev.filter(id => id !== m.id) : [...prev, m.id]
                        );
                      }}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${splitWith.includes(m.id) ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-100 text-slate-400'}`}
                    >
                      {splitWith.includes(m.id) ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 border rounded-full" />}
                      <span className="text-xs font-bold">{m.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                <button onClick={() => setIsAddingExpense(false)} className="flex-1 py-4 text-slate-400 font-bold">Cancel</button>
                <button onClick={handleAddExpense} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg">Save Split</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddingMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 space-y-4 animate-scaleIn">
            <h3 className="text-xl font-bold text-slate-900">Add Member</h3>
            <input 
              value={memName}
              onChange={(e) => setMemName(e.target.value)}
              placeholder="Name"
              className="w-full bg-slate-50 p-4 rounded-2xl text-slate-800 outline-none border border-slate-100"
            />
            <input 
              value={memContact}
              onChange={(e) => setMemContact(e.target.value)}
              placeholder="Phone or Email"
              className="w-full bg-slate-50 p-4 rounded-2xl text-slate-800 outline-none border border-slate-100"
            />
            <div className="flex gap-4 pt-4">
              <button onClick={() => setIsAddingMember(false)} className="flex-1 py-4 text-slate-400 font-bold">Cancel</button>
              <button onClick={handleAddMember} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;
