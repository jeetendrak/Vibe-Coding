
import React, { useState } from 'react';
import { Plus, Search, Filter, TrendingDown, TrendingUp, Calendar, Trash2, Edit2 } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface TransactionsScreenProps {
  transactions: Transaction[];
  onUpdate: (t: Transaction[]) => void;
}

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
                         (t.merchant?.toLowerCase() || '').includes(searchTerm.toLowerCase());
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
      date: new Date().toISOString()
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
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Ledger</h2>
        <button 
          onClick={handleOpenAdd}
          className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-100 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="flex-1 bg-white rounded-2xl px-4 py-2 flex items-center gap-2 border border-slate-100 shadow-sm">
          <Search size={18} className="text-slate-400" />
          <input 
            className="bg-transparent border-none outline-none text-sm w-full font-medium"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        {(['ALL', 'INCOME', 'EXPENSE'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              filterType === type ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length > 0 ? filtered.map(t => (
          <button 
            key={t.id} 
            onClick={() => handleOpenEdit(t)}
            className="w-full text-left bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm hover:border-indigo-100 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {t.type === 'INCOME' ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
              </div>
              <div>
                <p className="font-bold text-slate-800">{t.category}</p>
                <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                  <Calendar size={12} />
                  <p className="text-[10px] uppercase font-bold tracking-wider">
                    {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>
            </div>
            <p className={`text-lg font-black ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-800'}`}>
              {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toLocaleString()}
            </p>
          </button>
        )) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <Search size={48} className="mb-4 opacity-10" />
            <p className="font-bold text-slate-400">No transactions found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-slideUp">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Transaction' : 'New Transaction'}</h3>
              {editingId && (
                <button onClick={() => handleDelete(editingId)} className="text-rose-500 p-2 hover:bg-rose-50 rounded-xl transition-colors">
                  <Trash2 size={20} />
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                {(['INCOME', 'EXPENSE'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setNewType(type)}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                      newType === type 
                        ? (type === 'INCOME' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-indigo-600 text-white shadow-lg') 
                        : 'text-slate-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Amount (INR)</label>
                <input 
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 p-4 rounded-2xl text-3xl font-black text-indigo-600 outline-none border border-slate-100 focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-slate-800 outline-none border border-slate-100"
                  >
                    <option>Food</option>
                    <option>Rent</option>
                    <option>Salary</option>
                    <option>Shopping</option>
                    <option>Travel</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Note</label>
                  <input 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Lunch bill..."
                    className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-slate-800 outline-none border border-slate-100"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsAdding(false)} className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-transform">
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
