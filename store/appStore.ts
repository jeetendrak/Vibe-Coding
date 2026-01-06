
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
  transactions: [],
  emis: [],
  budgets: [],
  goals: [],
  investments: [],
  groups: [],
  branding: {
    name: 'SmartFin',
    logoUrl: ''
  }
};

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_DATA;
  try {
    const parsed = JSON.parse(stored);
    return {
      ...DEFAULT_DATA,
      ...parsed,
      branding: parsed.branding || DEFAULT_DATA.branding,
      transactions: parsed.transactions || [],
      emis: parsed.emis || [],
      budgets: parsed.budgets || [],
      goals: parsed.goals || [],
      investments: parsed.investments || [],
      groups: parsed.groups || []
    };
  } catch (e) {
    return DEFAULT_DATA;
  }
};

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getAuthUser = (): User | null => {
  const auth = localStorage.getItem(AUTH_KEY);
  if (!auth) return null;
  try {
    return JSON.parse(auth);
  } catch {
    return null;
  }
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
    if (parsed.branding) { // Basic validation
      saveData(parsed);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
