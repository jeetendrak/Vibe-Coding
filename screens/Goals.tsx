
import React, { useState } from 'react';
import { Target, TrendingUp, Plus, ChevronRight, Calculator, Trophy, PartyPopper, X } from 'lucide-react';
import { Goal } from '../types';

interface GoalsScreenProps {
  goals: Goal[];
  onUpdate: (goals: Goal[]) => void;
}

const GoalsScreen: React.FC<GoalsScreenProps> = ({ goals, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  
  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedGoalName, setCompletedGoalName] = useState('');

  const handleAddGoal = () => {
    if (!newName || !newTarget) return;
    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      targetAmount: parseFloat(newTarget),
      currentAmount: 0,
      deadline: new Date(new Date().getFullYear() + 1, 11, 31).toISOString()
    };
    onUpdate([...goals, newGoal]);
    setIsAdding(false);
    setNewName('');
    setNewTarget('');
  };

  const handleContribution = (id: string, amount: number) => {
    const goalToUpdate = goals.find(g => g.id === id);
    if (!goalToUpdate) return;

    const prevAmount = goalToUpdate.currentAmount;
    const newAmount = prevAmount + amount;
    
    // Check if goal just reached completion
    if (prevAmount < goalToUpdate.targetAmount && newAmount >= goalToUpdate.targetAmount) {
      setCompletedGoalName(goalToUpdate.name);
      setShowCelebration(true);
    }

    const updated = goals.map(g => 
      g.id === id ? { ...g, currentAmount: newAmount } : g
    );
    onUpdate(updated);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Savings Goals</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {goals.map(goal => {
          const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
          const isCompleted = goal.currentAmount >= goal.targetAmount;

          return (
            <div key={goal.id} className={`bg-white p-6 rounded-[32px] border shadow-sm space-y-4 transition-colors ${isCompleted ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-100'}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {isCompleted ? <Trophy size={24} /> : <Target size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{goal.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Ends: {new Date(goal.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${isCompleted ? 'text-emerald-600' : 'text-slate-800'}`}>₹{goal.currentAmount.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">Target: ₹{goal.targetAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className={`flex justify-between text-[10px] font-bold ${isCompleted ? 'text-emerald-600' : 'text-amber-600'}`}>
                  <span>{isCompleted ? 'Goal Achieved!' : `${progress.toFixed(0)}% Completed`}</span>
                  {!isCompleted && <span>₹{(goal.targetAmount - goal.currentAmount).toLocaleString()} Left</span>}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  onClick={() => handleContribution(goal.id, 1000)}
                  disabled={isCompleted}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${
                    isCompleted 
                    ? 'bg-slate-50 text-slate-300' 
                    : 'bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-600'
                  }`}
                >
                  +₹1,000
                </button>
                <button 
                  onClick={() => handleContribution(goal.id, 5000)}
                  disabled={isCompleted}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${
                    isCompleted 
                    ? 'bg-slate-50 text-slate-300' 
                    : 'bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-600'
                  }`}
                >
                  +₹5,000
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Goal Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-slideUp">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
            <h3 className="text-xl font-bold text-slate-900 mb-6">New Goal</h3>
            <div className="space-y-4">
              <input 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Goal Name (e.g. Travel to Bali)"
                className="w-full bg-slate-50 p-4 rounded-2xl text-slate-800 outline-none border border-slate-100 focus:ring-2 focus:ring-indigo-500"
              />
              <input 
                type="number"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                placeholder="Target Amount"
                className="w-full bg-slate-50 p-4 rounded-2xl text-slate-800 outline-none border border-slate-100 focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsAdding(false)} className="flex-1 py-4 text-slate-400 font-bold">Cancel</button>
                <button onClick={handleAddGoal} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg">Save Goal</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Celebration Popup */}
      {showCelebration && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 text-center space-y-6 relative overflow-hidden animate-[scaleIn_0.3s_ease-out]">
            {/* Background Decorative Circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-100 rounded-full opacity-50" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-indigo-100 rounded-full opacity-50" />
            
            <div className="relative">
              <div className="w-24 h-24 bg-amber-50 rounded-full mx-auto flex items-center justify-center text-amber-500 animate-bounce">
                <Trophy size={48} />
              </div>
              <div className="absolute top-0 right-1/4 animate-ping">
                <PartyPopper size={24} className="text-indigo-500" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Goal Achieved!</h3>
              <p className="text-slate-500 text-sm leading-relaxed px-4">
                Incredible work! You've successfully saved up for <span className="font-bold text-indigo-600">"{completedGoalName}"</span>.
              </p>
            </div>

            <div className="bg-emerald-50 py-3 px-6 rounded-2xl inline-block">
              <p className="text-emerald-700 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={14} /> 100% Milestone Reached
              </p>
            </div>

            <button 
              onClick={() => setShowCelebration(false)}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 active:scale-95 transition-all"
            >
              That's Great!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsScreen;
