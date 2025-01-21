import { create } from 'zustand';
import { Bill, BillFilters, CategoryTotal } from '../types';
import { supabase } from '../lib/supabase';

interface BillStore {
  bills: Bill[];
  filters: BillFilters;
  addBill: (bill: Omit<Bill, 'id'>) => Promise<void>;
  updateBill: (id: string, bill: Partial<Bill>) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  setFilters: (filters: BillFilters) => void;
  getFilteredBills: () => Bill[];
  getCategoryTotals: () => CategoryTotal[];
  getMonthlyTotals: () => { paid: number; unpaid: number };
  fetchBills: () => Promise<void>;
}

export const useBillStore = create<BillStore>((set, get) => ({
  bills: [],
  filters: {},

  fetchBills: async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;

    const { data: bills, error } = await supabase
      .from('bills')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching bills:', error);
      return;
    }

    set({ 
      bills: bills.map(bill => ({
        ...bill,
        dueDate: new Date(bill.due_date),
        isRecurring: bill.is_recurring,
        paidAmount: bill.paid_amount,
        recurringDay: bill.recurring_day,
      })) 
    });
  },

  addBill: async (bill) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No authenticated user');
      return;
    }

    const { error } = await supabase
      .from('bills')
      .insert({
        name: bill.name,
        amount: bill.amount,
        due_date: bill.dueDate.toISOString(),
        status: bill.status,
        category: bill.category,
        is_recurring: bill.isRecurring,
        paid_amount: bill.paidAmount,
        recurring_day: bill.recurringDay,
        user_id: session.user.id,
      });

    if (error) {
      console.error('Error adding bill:', error);
      return;
    }

    await get().fetchBills();
  },

  updateBill: async (id, updatedBill) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('bills')
      .update({
        ...(updatedBill.name && { name: updatedBill.name }),
        ...(updatedBill.amount && { amount: updatedBill.amount }),
        ...(updatedBill.dueDate && { due_date: updatedBill.dueDate.toISOString() }),
        ...(updatedBill.status && { status: updatedBill.status }),
        ...(updatedBill.category && { category: updatedBill.category }),
        ...(updatedBill.isRecurring !== undefined && { is_recurring: updatedBill.isRecurring }),
        ...(updatedBill.paidAmount !== undefined && { paid_amount: updatedBill.paidAmount }),
        ...(updatedBill.recurringDay !== undefined && { recurring_day: updatedBill.recurringDay }),
      })
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error updating bill:', error);
      return;
    }

    await get().fetchBills();
  },

  deleteBill: async (id) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('bills')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error deleting bill:', error);
      return;
    }

    await get().fetchBills();
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
      const remainingAmount = bill.status === 'PARTIALLY_PAID' 
        ? bill.amount - (bill.paidAmount || 0)
        : bill.status === 'PAID' 
          ? 0 
          : bill.amount;

      if (remainingAmount > 0) {
        totals[bill.category] = (totals[bill.category] || 0) + remainingAmount;
      }
    });

    return Object.entries(totals)
      .map(([category, total]) => ({
        category,
        total,
      }))
      .sort((a, b) => b.total - a.total);
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