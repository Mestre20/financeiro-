import React from 'react';
import { useBillStore } from '../store/useBillStore';

const CATEGORIES = [
  'Casa',
  'Transporte',
  'Alimentação',
  'Lazer',
  'Saúde',
  'Educação',
  'Outros',
];

interface BillFormProps {
  onSuccess: () => void;
}

export function BillForm({ onSuccess }: BillFormProps) {
  const addBill = useBillStore((state) => state.addBill);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const isRecurring = formData.get('isRecurring') === 'on';
    const dueDate = new Date(formData.get('dueDate') as string);
    
    addBill({
      name: formData.get('name') as string,
      amount: Number(formData.get('amount')),
      dueDate,
      category: formData.get('category') as string,
      status: 'UNPAID',
      isRecurring,
      recurringDay: isRecurring ? dueDate.getDate() : undefined,
      paidAmount: 0,
    });

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome da Conta
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Valor
        </label>
        <input
          type="number"
          name="amount"
          id="amount"
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Data de Vencimento
        </label>
        <input
          type="date"
          name="dueDate"
          id="dueDate"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Categoria
        </label>
        <select
          name="category"
          id="category"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isRecurring"
          id="isRecurring"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700">
          Conta Recorrente (Mensal)
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onSuccess}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}