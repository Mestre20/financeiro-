import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useBillStore } from '../store/useBillStore';
import { formatCurrency } from '../lib/utils';

export function Dashboard() {
  const categoryTotals = useBillStore((state) => state.getCategoryTotals());
  const monthlyTotals = useBillStore((state) => state.getMonthlyTotals());

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Resumo Mensal</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Pago:</span>
            <span className="text-green-600 font-medium">
              {formatCurrency(monthlyTotals.paid)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total a Pagar:</span>
            <span className="text-red-600 font-medium">
              {formatCurrency(monthlyTotals.unpaid)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
        <div className="h-64">
          {categoryTotals.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryTotals} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Categoria: ${label}`}
                />
                <Bar 
                  dataKey="total" 
                  fill="#4f46e5"
                  name="Total"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Nenhuma despesa registrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
}