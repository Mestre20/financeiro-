import React, { useEffect, useState } from 'react';
import { BillList } from './components/BillList';
import { Dashboard } from './components/Dashboard';
import { CreateBillButton } from './components/CreateBillButton';
import { useBillStore } from './store/useBillStore';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';

function App() {
  const fetchBills = useBillStore((state) => state.fetchBills);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchBills();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchBills();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchBills]);

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-indigo-600 text-white text-center py-1 text-sm">
        Site Desenvolvido por Rafael Rodrigues Silva
      </div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Minhas Contas</h1>
            <div className="flex items-center space-x-4">
              <CreateBillButton />
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sair
              </button>
            </div>
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