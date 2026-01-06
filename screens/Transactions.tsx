
import React, { useState } from 'react';
import { Plus, Search, Filter, TrendingDown, TrendingUp, Calendar, Trash2, Edit2 } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface TransactionsScreenProps {
  transactions: Transaction[];
  onUpdate: (t: Transaction[]) => void;
}

const CATEGORIES = {
  INCOME: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  EXPENSE: [
    'Food', 
    'Rent', 
    'Shopping', 
    'Travel', 
    'Entertainment',
    'Electricity Bill', 
    'Mobile Bill', 
    'Internet Bill',
    'Water Bill',
    'Home Loan EMI',
    'Car Loan EMI',
    'Credit Card Bill',
    'Personal Loan',
    'Healthcare',
    'Education',
    'Other'
  ]
};

const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ transactions, onUpdate }) => {
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modal State
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Food');
  const [newType, setNewType] = useState<TransactionType>('EXPENSE');
  const [newNote, setNewNote] = useState('');

  const filtered = transactions.filter(t => {
    const matchesType = filterType === 'ALL' || t.type === filterType;
    const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (t.merchant?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (t.note?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setNewAmount('');
    setNewCategory('Food');
    setNewType('EXPENSE');
    setNewNote('');
    setIsAdding(true);
  };

  const handleOpenEdit = (t: Transaction) => {
    setEditingId(t.id);
    setNewAmount(t.amount.toString());
    setNewCategory(t.category);
    setNewType(t.type);
    setNewNote(t.note || '');
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!newAmount) return;
    
    const transactionData: Transaction = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      amount: parseFloat(newAmount),
      category: newCategory,
      type: newType,
      note: newNote,
      date: editingId ? transactions.find(t => t.id === editingId)?.date || new Date().toISOString() : new Date().toISOString()
    };

    let newTransactions;
    if (editingId) {
      newTransactions = transactions.map(t => t.id === editingId ? transactionData : t);
    } else {
      newTransactions = [transactionData, ...transactions];
    }

    onUpdate(newTransactions);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this transaction?")) {
      onUpdate(transactions.filter(t => t.id !== id));
      setIsAdding(false);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn pb-32">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase tracking-widest text-sm">Ledger</h2>
        <button 
          onClick={handleOpenAdd}
          className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-100 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="bg-white rounded-[24px] px-5 py-3 flex items-center gap-3 border border-slate-100 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            className="bg-transparent border-none outline-none text-sm w-full font-bold text-slate-800 placeholder:text-slate-300"
            placeholder="Search by category, merchant, note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          {(['ALL', 'INCOME', 'EXPENSE'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                filterType === type ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length > 0 ? filtered.map(t => (
          <button 
            key={t.id} 
            onClick={() => handleOpenEdit(t)}
            className="w-full text-left bg-white p-5 rounded-[32px] border border-slate-100 flex items-center justify-between shadow-sm hover:border-indigo-100 transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {t.type === 'INCOME' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
              </div>
              <div className="flex-1">
                <p className="font-black text-slate-800 text-sm tracking-tight">{t.category}</p>
                <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                  <Calendar size={12} strokeWidth={2.5} />
                  <p className="text-[9px] uppercase font-black tracking-widest">
                    {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-black tracking-tight ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}`}>
                {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toLocaleString()}
              </p>
              {t.note && <p className="text-[9px] text-slate-300 font-bold uppercase truncate max-w-[100px] mt-1">{t.note}</p>}
            </div>
          </button>
        )) : (
          <div className="flex flex-col items-center justify-center py-24 text-slate-300 space-y-3">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center opacity-40">
              <Search size={40} />
            </div>
            <p className="font-black text-[10px] uppercase tracking-[0.2em]">No Matches Found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-slideUp border-t border-white/20">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {editingId ? 'Edit Entry' : 'Log Entry'}
              </h3>
              {editingId && (
                <button onClick={() => handleDelete(editingId)} className="text-rose-500 p-3 bg-rose-50 rounded-2xl hover:bg-rose-100 transition-colors">
                  <Trash2 size={20} />
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {(['INCOME', 'EXPENSE'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setNewType(type);
                      setNewCategory(CATEGORIES[type][0]);
                    }}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                      newType === type 
                        ? (type === 'INCOME' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-indigo-600 text-white shadow-lg') 
                        : 'text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">₹</span>
                  <input 
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="0.00"
                    autoFocus
                    className="w-full bg-slate-50 p-6 pl-12 rounded-[24px] text-3xl font-black text-indigo-600 outline-none border-2 border-transparent focus:border-indigo-600 transition-all placeholder:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 p-5 rounded-[20px] font-bold text-slate-800 outline-none border-2 border-transparent focus:border-indigo-600 appearance-none"
                  >
                    {CATEGORIES[newType].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Note (Optional)</label>
                  <input 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Specific details..."
                    className="w-full bg-slate-50 p-5 rounded-[20px] font-bold text-slate-800 outline-none border-2 border-transparent focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 pb-safe">
                <button onClick={() => setIsAdding(false)} className="flex-1 py-5 text-slate-400 font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 rounded-[20px]">
                  Cancel
                </button>
                <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-xl active:scale-95 transition-all">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsScreen;
