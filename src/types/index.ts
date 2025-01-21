export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  status: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID';
  category: string;
  isRecurring: boolean;
  paidAmount?: number;
  recurringDay?: number; // Day of the month for recurring bills
};

export type BillFilters = {
  status?: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID';
  month?: number;
  year?: number;
  search?: string;
};

export type CategoryTotal = {
  category: string;
  total: number;
};