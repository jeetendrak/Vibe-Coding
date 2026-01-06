
import React from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  Wallet, 
  ArrowRight,
  ChevronRight,
  PieChart as PieIcon,
  PiggyBank
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Transaction, EMI, Budget, Goal, Investment, AppScreen } from '../types';

interface DashboardProps {
  data: {
    transactions: Transaction[];
    emis: EMI[];
    budgets: Budget[];
    goals: Goal[];
    investments: Investment[];
  };
  onNavigate: (screen: AppScreen) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onNavigate }) => {
  const totalIncome = data.transactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const totalExpense = data.transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const categoryData = data.budgets.map(b => ({
    name: b.category,
    value: data.transactions
      .filter(t => t.type === 'EXPENSE' && t.category === b.category)
      .reduce((acc, t) => acc + t.amount, 0)
  })).filter(c => c.value > 0);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="p-6 space-y-8 animate-fadeIn">
      {/* Wallet Card */}
      <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet size={120} />
        </div>
        <p className="text-indigo-100 text-sm font-medium">Available Balance</p>
        <h2 className="text-3xl font-bold mt-1">₹ {balance.toLocaleString()}</h2>
        
        <div className="flex gap-4 mt-8">
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center">
                <TrendingUp size={12} className="text-emerald-900" />
              </div>
              <span className="text-xs text-indigo-100 font-medium">Income</span>
            </div>
            <p className="text-lg font-bold">₹{totalIncome.toLocaleString()}</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-5 h-5 rounded-full bg-rose-400 flex items-center justify-center">
                <TrendingDown size={12} className="text-rose-900" />
              </div>
              <span className="text-xs text-indigo-100 font-medium">Expense</span>
            </div>
            <p className="text-lg font-bold">₹{totalExpense.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('EMI')}
          className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <PieIcon className="text-blue-600" size={20} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800">EMIs</p>
            <p className="text-[10px] text-slate-400">Manage Loans</p>
          </div>
        </button>
        <button 
          onClick={() => onNavigate('GOALS')}
          className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <PiggyBank className="text-amber-600" size={20} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800">Savings</p>
            <p className="text-[10px] text-slate-400">Track Goals</p>
          </div>
        </button>
      </div>

      {/* Expense Analytics */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Expense Split</h3>
          <button className="text-indigo-600 text-sm font-semibold flex items-center gap-1">
            History <ChevronRight size={16} />
          </button>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm h-64 flex items-center justify-center">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-400 text-sm text-center">
              No expenses to show yet.<br/>Start by adding a transaction.
            </div>
          )}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
          <button onClick={() => onNavigate('TRANSACTIONS')} className="text-slate-400 text-sm flex items-center">
            See All <ChevronRight size={16} />
          </button>
        </div>
        <div className="space-y-3">
          {data.transactions.slice(0, 4).map(t => (
            <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
                }`}>
                  {t.type === 'INCOME' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{t.category}</p>
                  <p className="text-[10px] text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className={`font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-800'}`}>
                {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
