
import { Transaction, EMI, Budget, Goal, Investment, Group, User, Branding } from '../types';

const STORAGE_KEY = 'SMARTFIN_DATA_V1';
const AUTH_KEY = 'SMARTFIN_AUTH_V1';

interface AppData {
  transactions: Transaction[];
  emis: EMI[];
  budgets: Budget[];
  goals: Goal[];
  investments: Investment[];
  groups: Group[];
  branding: Branding;
}

const DEFAULT_DATA: AppData = {
  transactions: [
    { id: '1', amount: 50000, category: 'Salary', type: 'INCOME', note: 'Monthly Salary', date: new Date().toISOString() },
    { id: '2', amount: 1500, category: 'Food', type: 'EXPENSE', note: 'Dinner at Taj', date: new Date().toISOString() },
  ],
  emis: [
    { id: '1', loanName: 'Home Loan', amount: 25000, interestRate: 8.5, tenureMonths: 240, startDate: '2022-01-01', paidMonths: 26 }
  ],
  budgets: [
    { id: '1', category: 'Food', limit: 8000, spent: 1500 },
    { id: '2', category: 'Shopping', limit: 5000, spent: 0 },
    { id: '3', category: 'Travel', limit: 4000, spent: 200 }
  ],
  goals: [
    { id: '1', name: 'New Car', targetAmount: 800000, currentAmount: 150000, deadline: '2026-12-31' }
  ],
  investments: [
    { id: '1', type: 'MUTUAL_FUND', name: 'Quant Small Cap', investedAmount: 50000, currentValue: 62000, lastUpdated: new Date().toISOString() }
  ],
  groups: [],
  branding: {
    name: 'SmartFin',
    logoUrl: ''
  }
};

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_DATA;
  const parsed = JSON.parse(stored);
  // Ensure default structure for new fields
  return { ...DEFAULT_DATA, ...parsed, branding: parsed.branding || DEFAULT_DATA.branding };
};

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getAuthUser = (): User | null => {
  const auth = localStorage.getItem(AUTH_KEY);
  return auth ? JSON.parse(auth) : null;
};

export const setAuthUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
};

export const exportData = () => {
  const data = loadData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `smartfin_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
};

export const importData = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.transactions && parsed.emis && parsed.budgets) {
      saveData(parsed);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
