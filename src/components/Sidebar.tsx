// ============================================
// StokSaku — Sidebar Navigation
// Sleek glassmorphism sidebar with page navigation
// ============================================

import React from 'react';
import type { Page } from '../types';
import { DashboardIcon, BoxIcon, CashierIcon, LedgerIcon } from './Icons';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  lowStockCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

/** Navigation items configuration */
const NAV_ITEMS: { id: Page; label: string; sublabel: string; icon: React.FC<{ className?: string; size?: number }> }[] = [
  { id: 'dashboard', label: 'Dashboard', sublabel: 'Overview & Analytics', icon: DashboardIcon },
  { id: 'stock', label: 'Stok Produk', sublabel: 'Manajemen Inventaris', icon: BoxIcon },
  { id: 'cashier', label: 'Kasir Pintar', sublabel: 'Point of Sale', icon: CashierIcon },
  { id: 'kasbon', label: 'Buku Kasbon', sublabel: 'Catatan Hutang', icon: LedgerIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, lowStockCount, mobileOpen, onCloseMobile }) => {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 w-72
          bg-slate-950 text-white
          flex flex-col
          transition-transform duration-300 ease-out
          lg:translate-x-0 lg:static lg:z-auto
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* ---- Brand Header ---- */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BoxIcon className="text-white" size={18} />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-white">
                StokSaku
              </h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Smart UMKM Platform
              </p>
            </div>
          </div>
        </div>

        {/* ---- Navigation Links ---- */}
        <nav className="flex-1 px-3 mt-2 space-y-1">
          <p className="px-3 mb-3 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
            Menu Utama
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`
                  group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200 text-left relative overflow-hidden
                  ${isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }
                `}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                )}
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                  ${isActive
                    ? 'bg-indigo-600'
                    : 'bg-slate-800 group-hover:bg-slate-700'
                  }
                `}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold flex items-center gap-2">
                    {item.label}
                    {/* Low stock badge on stock page nav */}
                    {item.id === 'stock' && lowStockCount > 0 && (
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-semibold bg-rose-950/40 border border-rose-500/30 text-rose-400 rounded">
                        {lowStockCount}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.sublabel}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* ---- Bottom Section ---- */}
        <div className="p-4 border-t border-slate-900">
          {/* SDG 8 Badge */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">🌍</span>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 tracking-wide">
                  SDG 8
                </p>
                <p className="text-[9px] text-slate-500 leading-relaxed mt-0.5">
                  Decent Work &<br />Economic Growth
                </p>
              </div>
            </div>
          </div>
          <p className="text-center text-[9px] text-slate-600 mt-3">
            © 2026 StokSaku • Hackathon
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
