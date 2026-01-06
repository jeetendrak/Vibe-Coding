
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface Branding {
  name: string;
  logoUrl?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  subCategory?: string;
  type: TransactionType;
  note: string;
  date: string;
  merchant?: string;
}

export interface GroupMember {
  id: string;
  name: string;
  contact: string;
  isUser: boolean;
}

export interface GroupTransaction {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidById: string;
  splitBetweenIds: string[];
  date: string;
  category: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  transactions: GroupTransaction[];
  inviteCode: string;
  createdAt: string;
}

export interface EMI {
  id: string;
  loanName: string;
  amount: number;
  interestRate: number;
  tenureMonths: number;
  startDate: string;
  paidMonths: number;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface Investment {
  id: string;
  type: 'FD' | 'MUTUAL_FUND' | 'STOCKS' | 'GOLD';
  name: string;
  investedAmount: number;
  currentValue: number;
  lastUpdated: string;
}

export type AppScreen = 'AUTH' | 'DASHBOARD' | 'TRANSACTIONS' | 'SMS_PARSER' | 'EMI' | 'BUDGETS' | 'GOALS' | 'INVESTMENTS' | 'SETTINGS' | 'GROUPS' | 'GROUP_DETAIL' | 'PROFILE';
