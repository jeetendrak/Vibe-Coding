
import React, { useState } from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  Wallet, 
  ChevronRight,
  PieChart as PieIcon,
  PiggyBank,
  Plus,
  Trash2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction, EMI, Budget, Goal, Investment, AppScreen, TransactionType } from '../types';

interface DashboardProps {
  data: {
    transactions: Transaction[];
    emis: EMI[];
    budgets: Budget[];
    goals: Goal[];
    investments: Investment[];
  };
  onNavigate: (screen: AppScreen) => void;
  onUpdateTransactions?: (transactions: Transaction[]) => void;
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
    'Other'
  ]
};

const Dashboard: React.FC<DashboardProps> = ({ data, onNavigate, onUpdateTransactions }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newType, setNewType] = useState<TransactionType>('EXPENSE');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Food');
  const [newNote, setNewNote] = useState('');

  const totalIncome = data.transactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const totalExpense = data.transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const categoryData = Object.values(
    data.transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc: any, t) => {
        if (!acc[t.category]) acc[t.category] = { name: t.category, value: 0 };
        acc[t.category].value += t.amount;
        return acc;
      }, {})
  ).sort((a: any, b: any) => b.value - a.value) as { name: string, value: number }[];

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const handleOpenAdd = (type: TransactionType) => {
    setNewType(type);
    setNewAmount('');
    setNewCategory(type === 'INCOME' ? 'Salary' : 'Food');
    setNewNote('');
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!newAmount || !onUpdateTransactions) return;
    
    const transactionData: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount: parseFloat(newAmount),
      category: newCategory,
      type: newType,
      note: newNote,
      date: new Date().toISOString()
    };

    onUpdateTransactions([transactionData, ...data.transactions]);
    setIsAdding(false);
  };

  return (
    <div className="p-6 space-y-8 animate-fadeIn relative pb-20">
      {/* Wallet Card */}
      <div className="bg-indigo-600 rounded-[32px] p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet size={120} />
        </div>
        <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest opacity-80">Total Balance</p>
        <h2 className="text-4xl font-black mt-1 tracking-tight">₹ {balance.toLocaleString()}</h2>
        
        <div className="flex gap-4 mt-8">
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center">
                <TrendingUp size={12} className="text-emerald-900" />
              </div>
              <span className="text-[10px] text-indigo-100 font-bold uppercase tracking-wider">Income</span>
            </div>
            <p className="text-lg font-black">₹{totalIncome.toLocaleString()}</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-rose-400 flex items-center justify-center">
                <TrendingDown size={12} className="text-rose-900" />
              </div>
              <span className="text-[10px] text-indigo-100 font-bold uppercase tracking-wider">Expense</span>
            </div>
            <p className="text-lg font-black">₹{totalExpense.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleOpenAdd('INCOME')}
          className="bg-emerald-50 border border-emerald-100 p-4 rounded-3xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-sm group"
        >
          <div className="w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
            <Plus size={20} />
          </div>
          <div className="text-left">
            <p className="text-xs font-black text-emerald-800 uppercase tracking-wider">Income</p>
            <p className="text-[10px] text-emerald-600/70 font-bold">Add Funds</p>
          </div>
        </button>
        <button 
          onClick={() => handleOpenAdd('EXPENSE')}
          className="bg-rose-50 border border-rose-100 p-4 rounded-3xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-sm group"
        >
          <div className="w-10 h-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center group-hover:bg-rose-600 transition-colors">
            <Plus size={20} />
          </div>
          <div className="text-left">
            <p className="text-xs font-black text-rose-800 uppercase tracking-wider">Expense</p>
            <p className="text-[10px] text-rose-600/70 font-bold">Log Spend</p>
          </div>
        </button>
      </div>

      {/* Quick Access Tools */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('EMI')}
          className="bg-white border border-slate-100 p-5 rounded-3xl flex items-center gap-4 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
            <PieIcon className="text-blue-600" size={24} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800">Loans</p>
            <p className="text-[10px] text-slate-400 font-bold">EMI Tracker</p>
          </div>
        </button>
        <button 
          onClick={() => onNavigate('GOALS')}
          className="bg-white border border-slate-100 p-5 rounded-3xl flex items-center gap-4 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
            <PiggyBank className="text-amber-600" size={24} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800">Goals</p>
            <p className="text-[10px] text-slate-400 font-bold">Savings</p>
          </div>
        </button>
      </div>

      {/* Charts Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Spending Split</h3>
          <button onClick={() => onNavigate('TRANSACTIONS')} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
            Analytics <ChevronRight size={14} />
          </button>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm h-72 flex items-center justify-center">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-400 text-xs font-bold text-center space-y-2">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto opacity-40">
                <PieIcon size={32} />
              </div>
              <p>No transactions yet.<br/>Tap Income or Expense to start.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Ledger</h3>
          <button onClick={() => onNavigate('TRANSACTIONS')} className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
            History <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-3">
          {data.transactions.length > 0 ? data.transactions.slice(0, 5).map(t => (
            <div key={t.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {t.type === 'INCOME' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{t.category}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-sm ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toLocaleString()}
                </p>
                {t.note && <p className="text-[8px] text-slate-400 font-bold uppercase truncate max-w-[80px]">{t.note}</p>}
              </div>
            </div>
          )) : (
            <div className="text-center py-10 text-slate-300 font-bold text-xs uppercase tracking-widest">
              Empty Ledger
            </div>
          )}
        </div>
      </section>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[200] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-slideUp border-t border-white/20">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {newType === 'INCOME' ? 'Log Income' : 'Log Expense'}
              </h3>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                newType === 'INCOME' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {newType}
              </div>
            </div>
            
            <div className="space-y-6">
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
                    placeholder="Lunch at Blue Tokai..."
                    className="w-full bg-slate-50 p-5 rounded-[20px] font-bold text-slate-800 outline-none border-2 border-transparent focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 pb-safe">
                <button 
                  onClick={() => setIsAdding(false)} 
                  className="flex-1 py-5 text-slate-400 font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 rounded-[20px] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={!newAmount}
                  className="flex-1 bg-indigo-600 text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-100 active:scale-95 transition-all disabled:opacity-50"
                >
                  Confirm Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
