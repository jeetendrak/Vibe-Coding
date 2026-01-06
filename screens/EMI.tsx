
import React from 'react';
import { PieChart, CreditCard, Calendar, TrendingDown, Info } from 'lucide-react';
import { EMI } from '../types';

interface EMIScreenProps {
  emis: EMI[];
  onUpdate: (emis: EMI[]) => void;
}

const EMIScreen: React.FC<EMIScreenProps> = ({ emis, onUpdate }) => {
  const handleMarkPaid = (id: string) => {
    const updated = emis.map(e => 
      e.id === id ? { ...e, paidMonths: Math.min(e.tenureMonths, e.paidMonths + 1) } : e
    );
    onUpdate(updated);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Loans & EMIs</h2>
        <p className="text-slate-500 text-sm">Stay on top of your monthly commitments.</p>
      </div>

      <div className="space-y-4">
        {emis.map(emi => {
          const progress = (emi.paidMonths / emi.tenureMonths) * 100;
          return (
            <div key={emi.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-5">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{emi.loanName}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{emi.interestRate}% Interest Rate</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-indigo-600">₹{emi.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Monthly EMI</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar size={12} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tenure</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{emi.paidMonths} / {emi.tenureMonths} Months</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingDown size={12} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Remaining</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">₹{((emi.tenureMonths - emi.paidMonths) * emi.amount).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>{progress.toFixed(0)}% Repaid</span>
                  <span>{emi.tenureMonths - emi.paidMonths} Months Left</span>
                </div>
              </div>

              <button 
                onClick={() => handleMarkPaid(emi.id)}
                className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-slate-200 active:scale-95 transition-transform"
              >
                Mark Current Month Paid
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3 text-blue-700">
        <Info size={20} className="shrink-0" />
        <p className="text-xs leading-relaxed">
          The remaining balance shown is an estimation based on the EMI amount. For exact figures, please consult your bank's amortization schedule.
        </p>
      </div>
    </div>
  );
};

export default EMIScreen;
