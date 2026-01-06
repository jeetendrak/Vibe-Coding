
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Share2, 
  CheckCircle2, 
  CreditCard,
  UserPlus,
  Edit2,
  Trash2,
  UserMinus,
  AlertTriangle
} from 'lucide-react';
import { Group, GroupMember, GroupTransaction } from '../types';

interface GroupDetailProps {
  group: Group;
  onBack: () => void;
  onUpdateGroup: (group: Group) => void;
}

const GroupDetail: React.FC<GroupDetailProps> = ({ group, onBack, onUpdateGroup }) => {
  const [tab, setTab] = useState<'EXPENSES' | 'BALANCES'>('EXPENSES');
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<GroupMember | null>(null);

  // Form State
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('u1');
  const [splitWith, setSplitWith] = useState<string[]>(group.members.map(m => m.id));

  // New Member State
  const [memName, setMemName] = useState('');
  const [memContact, setMemContact] = useState('');

  const handleOpenAdd = () => {
    setEditingExpenseId(null);
    setDesc('');
    setAmount('');
    setPaidBy('u1');
    setSplitWith(group.members.map(m => m.id));
    setIsAddingExpense(true);
  };

  const handleEditExpense = (tx: GroupTransaction) => {
    setEditingExpenseId(tx.id);
    setDesc(tx.description);
    setAmount(tx.amount.toString());
    setPaidBy(tx.paidById);
    setSplitWith(tx.splitBetweenIds);
    setIsAddingExpense(true);
  };

  const handleAddOrUpdateExpense = () => {
    if (!desc || !amount || splitWith.length === 0) return;
    
    const expenseData: GroupTransaction = {
      id: editingExpenseId || Math.random().toString(36).substr(2, 9),
      groupId: group.id,
      description: desc,
      amount: parseFloat(amount),
      paidById: paidBy,
      splitBetweenIds: splitWith,
      date: new Date().toISOString(),
      category: 'Other'
    };

    let updatedTransactions;
    if (editingExpenseId) {
      updatedTransactions = group.transactions.map(t => t.id === editingExpenseId ? expenseData : t);
    } else {
      updatedTransactions = [expenseData, ...group.transactions];
    }

    onUpdateGroup({ ...group, transactions: updatedTransactions });
    setIsAddingExpense(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm("Delete this expense?")) {
      onUpdateGroup({ ...group, transactions: group.transactions.filter(t => t.id !== id) });
    }
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

  const handleRemoveMember = () => {
    if (!memberToRemove) return;
    
    // Check if member has transactions where they paid or are part of split
    const hasTransactions = group.transactions.some(t => 
      t.paidById === memberToRemove.id || t.splitBetweenIds.includes(memberToRemove.id)
    );

    const bal = memberBalances[memberToRemove.id] || 0;
    const isSettled = Math.abs(bal) < 0.01;

    if (!isSettled) {
      alert(`Cannot remove ${memberToRemove.name}. They have an unsettled balance of ₹${bal.toFixed(2)}. Please settle up first.`);
      setMemberToRemove(null);
      return;
    }

    if (hasTransactions) {
      if (!confirm(`${memberToRemove.name} has past transaction history in this group. Removing them will keep existing records but mark them as a deleted member. Continue?`)) {
        setMemberToRemove(null);
        return;
      }
    }

    onUpdateGroup({
      ...group,
      members: group.members.filter(m => m.id !== memberToRemove.id)
    });
    setMemberToRemove(null);
  };

  const calculateMemberBalances = () => {
    const balances: Record<string, number> = {};
    group.members.forEach(m => balances[m.id] = 0);

    group.transactions.forEach(t => {
      const perPerson = t.amount / t.splitBetweenIds.length;
      t.splitBetweenIds.forEach(id => {
        if (balances[id] !== undefined) balances[id] -= perPerson;
      });
      if (balances[t.paidById] !== undefined) balances[t.paidById] += t.amount;
    });
    return balances;
  };

  const memberBalances = calculateMemberBalances();

  const shareGroup = () => {
    const origin = window.location.origin;
    const link = `${origin}/?joinGroup=${group.inviteCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Join my SmartFin Group: ${group.name}`,
        text: `Split bills easily! Join using this link:`,
        url: link
      });
    } else {
      navigator.clipboard.writeText(link);
      alert("Invite link copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative animate-fadeIn">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-50 rounded-full text-slate-400">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800">{group.name}</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{group.members.length} Members • {group.inviteCode}</p>
        </div>
        <button onClick={shareGroup} className="p-2 text-indigo-600 bg-indigo-50 rounded-xl active:scale-95">
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
              <div key={t.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group/item">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{t.description}</p>
                    <p className="text-[10px] text-slate-400">
                      Paid by <span className="text-indigo-600 font-bold">{group.members.find(m => m.id === t.paidById)?.name || 'Deleted Member'}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-black text-slate-800">₹{t.amount.toLocaleString()}</p>
                    <p className="text-[8px] text-slate-400 uppercase font-bold">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleEditExpense(t)} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                    <Edit2 size={14} />
                  </button>
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
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Member Balances</h4>
              <button onClick={() => setIsAddingMember(true)} className="text-indigo-600 text-[10px] font-bold uppercase flex items-center gap-1">
                <UserPlus size={12} /> Add Member
              </button>
            </div>
            {group.members.map(member => {
              const bal = memberBalances[member.id] || 0;
              return (
                <div key={member.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between group/member">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${member.isUser ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800 text-sm">{member.name} {member.isUser && '(You)'}</p>
                        {!member.isUser && (
                          <button 
                            onClick={() => setMemberToRemove(member)}
                            className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover/member:opacity-100"
                          >
                            <UserMinus size={14} />
                          </button>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-400">{member.contact || 'No contact info'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {Math.abs(bal) < 0.01 ? (
                      <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">Settled</p>
                    ) : (
                      <div className="flex flex-col items-end">
                        <p className={`text-sm font-black ${bal > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {bal > 0 ? '+' : '-'}₹{Math.abs(bal).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">
                          {bal > 0 ? 'To receive' : 'To pay'}
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

      {/* FAB */}
      {tab === 'EXPENSES' && (
        <button 
          onClick={handleOpenAdd}
          className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-[20px] shadow-xl shadow-indigo-100 flex items-center justify-center active:scale-95 transition-transform z-50"
        >
          <Plus size={28} />
        </button>
      )}

      {/* Expense Modal */}
      {isAddingExpense && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-slideUp">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">{editingExpenseId ? 'Edit Split' : 'New Split'}</h3>
              {editingExpenseId && (
                <button onClick={() => handleDeleteExpense(editingExpenseId)} className="text-rose-500 p-2 hover:bg-rose-50 rounded-xl transition-colors">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">What for?</label>
                <input 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g. Dinner, Fuel, Airbnb"
                  className="w-full bg-slate-50 p-4 rounded-2xl text-slate-800 outline-none border border-slate-100 focus:border-indigo-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Total Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 p-4 pl-8 rounded-2xl text-lg font-bold text-indigo-600 outline-none border border-slate-100"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase ml-2">Paid By</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {group.members.map(m => (
                    <button 
                      key={m.id}
                      onClick={() => setPaidBy(m.id)}
                      className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${paidBy === m.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-100'}`}
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
                      className={`flex items-center gap-2 p-3 rounded-2xl border transition-all ${splitWith.includes(m.id) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-100 text-slate-400'}`}
                    >
                      {splitWith.includes(m.id) ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 border-2 rounded-lg" />}
                      <span className="text-xs font-bold">{m.name}</span>
                    </button>
                  ))}
                </div>
                {amount && splitWith.length > 0 && (
                  <p className="text-[10px] text-slate-400 font-medium text-center mt-2">
                    ₹{(parseFloat(amount) / splitWith.length).toFixed(2)} per person
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                <button onClick={() => setIsAddingExpense(false)} className="flex-1 py-4 text-slate-400 font-bold">Cancel</button>
                <button onClick={handleAddOrUpdateExpense} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-transform">
                  {editingExpenseId ? 'Update Split' : 'Save Split'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {isAddingMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[210] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 space-y-4 animate-scaleIn">
            <h3 className="text-xl font-bold text-slate-900">Add Member</h3>
            <div className="space-y-3">
              <input 
                value={memName}
                onChange={(e) => setMemName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-slate-50 p-4 rounded-2xl text-slate-800 outline-none border border-slate-100"
              />
              <input 
                value={memContact}
                onChange={(e) => setMemContact(e.target.value)}
                placeholder="Phone or Email (Optional)"
                className="w-full bg-slate-50 p-4 rounded-2xl text-slate-800 outline-none border border-slate-100"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={() => setIsAddingMember(false)} className="flex-1 py-4 text-slate-400 font-bold">Cancel</button>
              <button onClick={handleAddMember} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Member Deletion Confirmation Modal */}
      {memberToRemove && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[220] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 text-center space-y-4 animate-scaleIn">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full mx-auto flex items-center justify-center mb-2">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Remove Member?</h3>
            <p className="text-slate-500 text-sm">
              Are you sure you want to remove <span className="font-bold text-slate-800">{memberToRemove.name}</span> from this group?
            </p>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setMemberToRemove(null)} 
                className="flex-1 py-4 text-slate-400 font-bold"
              >
                Keep
              </button>
              <button 
                onClick={handleRemoveMember} 
                className="flex-1 bg-rose-500 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;
