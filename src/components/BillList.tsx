import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, X, Trash2, DollarSign } from 'lucide-react';
import { useBillStore } from '../store/useBillStore';
import { formatCurrency } from '../lib/utils';
import * as Dialog from '@radix-ui/react-dialog';

export function BillList() {
  const bills = useBillStore((state) => state.getFilteredBills());
  const updateBill = useBillStore((state) => state.updateBill);
  const deleteBill = useBillStore((state) => state.deleteBill);
  const [selectedBill, setSelectedBill] = React.useState<string | null>(null);
  const [partialAmount, setPartialAmount] = React.useState<string>('');

  const handlePaymentDialog = (billId: string) => {
    setSelectedBill(billId);
    setPartialAmount('');
  };

  const handlePayment = (type: 'FULL' | 'PARTIAL') => {
    if (!selectedBill) return;

    const bill = bills.find((b) => b.id === selectedBill);
    if (!bill) return;

    if (type === 'FULL') {
      updateBill(selectedBill, { 
        status: 'PAID',
        paidAmount: bill.amount 
      });
    } else if (type === 'PARTIAL') {
      const amount = Number(partialAmount);
      if (isNaN(amount) || amount <= 0 || amount >= bill.amount) return;

      updateBill(selectedBill, {
        status: 'PARTIALLY_PAID',
        paidAmount: amount
      });
    }

    setSelectedBill(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PARTIALLY_PAID':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Pago';
      case 'PARTIALLY_PAID':
        return 'Parcialmente Pago';
      default:
        return 'Não Pago';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left">Nome</th>
            <th className="px-4 py-3 text-left">Valor</th>
            <th className="px-4 py-3 text-left">Vencimento</th>
            <th className="px-4 py-3 text-left">Categoria</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Tipo</th>
            <th className="px-4 py-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{bill.name}</td>
              <td className="px-4 py-3">
                {bill.status === 'PARTIALLY_PAID' ? (
                  <div>
                    <div className="text-gray-500 line-through">{formatCurrency(bill.amount)}</div>
                    <div>{formatCurrency(bill.amount - (bill.paidAmount || 0))}</div>
                  </div>
                ) : (
                  formatCurrency(bill.amount)
                )}
              </td>
              <td className="px-4 py-3">
                {format(bill.dueDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </td>
              <td className="px-4 py-3">{bill.category}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    bill.status
                  )}`}
                >
                  {getStatusText(bill.status)}
                </span>
              </td>
              <td className="px-4 py-3">
                {bill.isRecurring ? 'Recorrente' : 'Única'}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  {bill.status !== 'PAID' && (
                    <button
                      onClick={() => handlePaymentDialog(bill.id)}
                      className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100"
                      title="Registrar Pagamento"
                    >
                      <DollarSign className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteBill(bill.id)}
                    className="p-1 rounded-full text-red-600 hover:bg-red-100"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog.Root open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Registrar Pagamento
            </Dialog.Title>
            
            <div className="space-y-4">
              <button
                onClick={() => handlePayment('FULL')}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-md"
              >
                Pagamento Total
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="partialAmount" className="block text-sm font-medium text-gray-700">
                  Valor Parcial
                </label>
                <input
                  type="number"
                  id="partialAmount"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  min="0"
                  step="0.01"
                />
                <button
                  onClick={() => handlePayment('PARTIAL')}
                  disabled={!partialAmount}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Registrar Pagamento Parcial
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}