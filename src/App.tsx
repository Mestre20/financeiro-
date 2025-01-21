import React from 'react';
import { BillList } from './components/BillList';
import { Dashboard } from './components/Dashboard';
import { CreateBillButton } from './components/CreateBillButton';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Minhas Contas</h1>
            <CreateBillButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Dashboard />
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <BillList />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;