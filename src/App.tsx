// ============================================
// StokSaku — Main Application Shell
// Orchestrates state, routing, and layout
// ============================================

import React, { useState, useCallback } from 'react';
import type { Page, Product, Transaction } from './types';
import { INITIAL_PRODUCTS } from './data';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StockManagement from './components/StockManagement';
import Cashier from './components/Cashier';
import BukuKasbon from './components/BukuKasbon';
import { MenuIcon } from './components/Icons';

const App: React.FC = () => {
  // ---- Global Application State ----
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ---- Derived State ----
  const lowStockCount = products.filter((p) => p.stock < 5).length;

  // ---- Transaction handler ----
  const handleTransaction = useCallback((transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  }, []);

  // ---- Page title map ----
  const pageTitle: Record<Page, string> = {
    dashboard: 'Dashboard',
    stock: 'Manajemen Stok',
    cashier: 'Kasir Pintar',
    kasbon: 'Buku Kasbon',
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* ---- Sidebar Navigation ---- */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        lowStockCount={lowStockCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* ---- Main Content Area ---- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ---- Top Header Bar ---- */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200/80 flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
            >
              <MenuIcon />
            </button>
            <div>
              <h1 className="text-base font-semibold text-slate-900 tracking-tight">
                {pageTitle[currentPage]}
              </h1>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Right side: status indicators */}
          <div className="flex items-center gap-3">
            {/* Low stock indicator */}
            {lowStockCount > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50/60 border border-rose-100">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-xs font-semibold text-rose-700">
                  {lowStockCount} stok rendah
                </span>
              </div>
            )}

            {/* Transaction count indicator */}
            {transactions.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-emerald-700">
                  {transactions.length} transaksi
                </span>
              </div>
            )}

            {/* User avatar placeholder */}
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer">
              U
            </div>
          </div>
        </header>

        {/* ---- Page Content ---- */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentPage === 'dashboard' && (
            <Dashboard products={products} transactions={transactions} />
          )}
          {currentPage === 'stock' && (
            <StockManagement products={products} setProducts={setProducts} />
          )}
          {currentPage === 'cashier' && (
            <Cashier
              products={products}
              setProducts={setProducts}
              onTransaction={handleTransaction}
            />
          )}
          {currentPage === 'kasbon' && (
            <BukuKasbon />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
