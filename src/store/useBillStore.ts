import { create } from 'zustand';
import { Bill, BillFilters, CategoryTotal } from '../types';

interface BillStore {
  bills: Bill[];
  filters: BillFilters;
  addBill: (bill: Omit<Bill, 'id'>) => void;
  updateBill: (id: string, bill: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  setFilters: (filters: BillFilters) => void;
  getFilteredBills: () => Bill[];
  getCategoryTotals: () => CategoryTotal[];
  getMonthlyTotals: () => { paid: number; unpaid: number };
}

export const useBillStore = create<BillStore>((set, get) => ({
  bills: [],
  filters: {},

  addBill: (bill) => {
    set((state) => ({
      bills: [...state.bills, { ...bill, id: crypto.randomUUID() }],
    }));
  },

  updateBill: (id, updatedBill) => {
    set((state) => ({
      bills: state.bills.map((bill) =>
        bill.id === id ? { ...bill, ...updatedBill } : bill
      ),
    }));
  },

  deleteBill: (id) => {
    set((state) => ({
      bills: state.bills.filter((bill) => bill.id !== id),
    }));
  },

  setFilters: (filters) => {
    set({ filters });
  },

  getFilteredBills: () => {
    const { bills, filters } = get();
    return bills.filter((bill) => {
      if (filters.status && bill.status !== filters.status) return false;
      if (filters.month && bill.dueDate.getMonth() !== filters.month - 1) return false;
      if (filters.year && bill.dueDate.getFullYear() !== filters.year) return false;
      if (filters.search && !bill.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  },

  getCategoryTotals: () => {
    const bills = get().getFilteredBills();
    const totals: Record<string, number> = {};
    
    bills.forEach((bill) => {
      // Calculate the remaining amount for each bill
      const remainingAmount = bill.status === 'PARTIALLY_PAID' 
        ? bill.amount - (bill.paidAmount || 0)
        : bill.status === 'PAID' 
          ? 0 
          : bill.amount;

      if (remainingAmount > 0) {
        totals[bill.category] = (totals[bill.category] || 0) + remainingAmount;
      }
    });

    // Convert to array and sort by total
    return Object.entries(totals)
      .map(([category, total]) => ({
        category,
        total,
      }))
      .sort((a, b) => b.total - a.total); // Sort by total in descending order
  },

  getMonthlyTotals: () => {
    const bills = get().getFilteredBills();
    return {
      paid: bills.reduce((acc, bill) => {
        if (bill.status === 'PAID') return acc + bill.amount;
        if (bill.status === 'PARTIALLY_PAID') return acc + (bill.paidAmount || 0);
        return acc;
      }, 0),
      unpaid: bills.reduce((acc, bill) => {
        if (bill.status === 'UNPAID') return acc + bill.amount;
        if (bill.status === 'PARTIALLY_PAID') return acc + (bill.amount - (bill.paidAmount || 0));
        return acc;
      }, 0),
    };
  },
}));