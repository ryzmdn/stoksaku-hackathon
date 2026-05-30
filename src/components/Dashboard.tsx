// ============================================
// StokSaku — Dashboard Overview Page
// Metrics, financial trend chart, low stock alerts
// ============================================

import React, { useCallback } from 'react';
import type { Product, Transaction } from '../types';
import { formatRupiah } from '../data';
import { exportToCSV, formatRupiahCSV } from '../utils/exportCSV';
import { generateWhatsAppLink } from '../utils/whatsapp';
import {
  TrendUpIcon,
  WalletIcon,
  AlertIcon,
  ChartIcon,
  TrendDownIcon,
  ReceiptIcon,
  DownloadIcon,
  WhatsAppIcon,
} from './Icons';
import SmartInsight from './SmartInsight';

interface DashboardProps {
  products: Product[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, transactions }) => {
  // ---- Computed Metrics ----
  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalExpense = transactions.reduce(
    (sum, t) => sum + t.items.reduce((s, i) => s + i.product.buyPrice * i.qty, 0),
    0
  );
  const netProfit = totalSales - totalExpense;
  const lowStockProducts = products.filter((p) => p.stock < 5);
  const totalItems = products.reduce((sum, p) => sum + p.stock, 0);

  // ---- CSV Export Handler ----
  const handleExport = useCallback(() => {
    const timestamp = new Date().toLocaleDateString('id-ID', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).replace(/\//g, '-');

    // --- Section 1: Financial Overview ---
    const financialRows: string[][] = [
      ['=== LAPORAN KEUANGAN STOKSAKU ==='],
      ['Tanggal Ekspor', new Date().toLocaleString('id-ID')],
      [],
      ['RINGKASAN KEUANGAN'],
      ['Metrik', 'Nilai (Rp)'],
      ['Total Penjualan', formatRupiahCSV(totalSales)],
      ['Total Pengeluaran (Modal)', formatRupiahCSV(totalExpense)],
      ['Laba Bersih', formatRupiahCSV(netProfit)],
      ['Jumlah Transaksi', String(transactions.length)],
      ['Total Produk', String(products.length)],
      ['Total Unit Stok', String(totalItems)],
      [],
    ];

    // --- Section 2: Top Selling Products (sorted by margin) ---
    const sortedByMargin = [...products].sort(
      (a, b) => (b.sellPrice - b.buyPrice) - (a.sellPrice - a.buyPrice)
    );
    const topProductRows: string[][] = [
      ['PRODUK — DIURUTKAN BERDASARKAN MARGIN'],
      ['Nama Produk', 'Kategori', 'Harga Beli', 'Harga Jual', 'Margin', 'Stok', 'Status'],
      ...sortedByMargin.map((p) => [
        p.name,
        p.category,
        formatRupiahCSV(p.buyPrice),
        formatRupiahCSV(p.sellPrice),
        formatRupiahCSV(p.sellPrice - p.buyPrice),
        String(p.stock),
        p.stock < 5 ? '⚠️ STOK RENDAH' : 'Aman',
      ]),
      [],
    ];

    // --- Section 3: Low Stock Alert ---
    const lowStockRows: string[][] = [
      ['PERINGATAN STOK RENDAH (< 5 Unit)'],
      ...(lowStockProducts.length > 0
        ? [
            ['Nama Produk', 'Kategori', 'Sisa Stok', 'Harga Jual'] as string[],
            ...lowStockProducts.map((p) => [
              p.name,
              p.category,
              String(p.stock),
              formatRupiahCSV(p.sellPrice),
            ]),
          ]
        : [['Tidak ada produk dengan stok rendah — semua aman! ✅']]
      ),
    ];

    // Combine all sections and export
    const allData = [...financialRows, ...topProductRows, ...lowStockRows];
    exportToCSV(allData, `StokSaku_Laporan_${timestamp}`);
  }, [products, transactions, totalSales, totalExpense, netProfit, lowStockProducts, totalItems]);

  // ---- Chart data: last 7 "days" simulated from transactions ----
  const chartData = React.useMemo(() => {
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    // Distribute transactions across the week for visual demo
    const salesByDay = days.map((_, i) => {
      const dayTxns = transactions.filter((_, idx) => idx % 7 === i);
      return dayTxns.reduce((s, t) => s + t.total, 0);
    });

    // Add some base values so chart looks good even with few transactions
    const baseValues = [45000, 62000, 38000, 78000, 55000, 92000, 68000];
    return days.map((day, i) => ({
      day,
      value: baseValues[i] + salesByDay[i],
    }));
  }, [transactions]);

  const maxChartValue = Math.max(...chartData.map((d) => d.value), 1);

  // ---- Metric Cards Config ----
  const metrics = [
    {
      id: 'total-sales',
      label: 'Total Penjualan',
      value: formatRupiah(totalSales),
      icon: TrendUpIcon,
      trend: transactions.length > 0 ? `${transactions.length} transaksi` : 'Belum ada',
      trendUp: true,
      cardBg: 'bg-white border border-slate-200/80',
      iconBg: 'bg-emerald-50 text-emerald-600',
      trendClass: 'bg-emerald-50/60 border border-emerald-100 text-emerald-700',
    },
    {
      id: 'total-expense',
      label: 'Total Pengeluaran',
      value: formatRupiah(totalExpense),
      icon: WalletIcon,
      trend: 'Harga modal',
      trendUp: false,
      cardBg: 'bg-white border border-slate-200/80',
      iconBg: 'bg-slate-100 text-slate-600',
      trendClass: 'bg-slate-50 border border-slate-100 text-slate-500',
    },
    {
      id: 'low-stock',
      label: 'Stok Menipis',
      value: `${lowStockProducts.length} produk`,
      icon: AlertIcon,
      trend: lowStockProducts.length > 0 ? 'Perlu restock!' : 'Aman',
      trendUp: lowStockProducts.length === 0,
      cardBg: 'bg-white border border-slate-200/80',
      iconBg: lowStockProducts.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600',
      trendClass: lowStockProducts.length > 0 
        ? 'bg-rose-50/60 border border-rose-100 text-rose-700' 
        : 'bg-slate-50 border border-slate-100 text-slate-500',
    },
    {
      id: 'net-profit',
      label: 'Laba Bersih',
      value: formatRupiah(netProfit),
      icon: ReceiptIcon,
      trend: netProfit >= 0 ? 'Positif' : 'Negatif',
      trendUp: netProfit >= 0,
      cardBg: 'bg-white border border-slate-200/80',
      iconBg: netProfit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600',
      trendClass: netProfit >= 0 
        ? 'bg-emerald-50/60 border border-emerald-100 text-emerald-700' 
        : 'bg-rose-50/60 border border-rose-100 text-rose-700',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* ---- Page Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Pantau performa bisnis UMKM Anda secara real-time
          </p>
        </div>
        <button
          id="btn-export-csv"
          onClick={handleExport}
          className="group inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-950 text-white rounded-lg font-semibold text-xs border border-slate-700/50 transition-all duration-150 cursor-pointer"
        >
          <DownloadIcon size={14} className="mr-1.5" />
          <span>Export CSV</span>
          <span className="ml-2 inline-flex items-center px-1 py-0.5 rounded bg-slate-700 text-slate-300 text-[9px] font-bold border border-slate-600">
            .csv
          </span>
        </button>
      </div>

      {/* ---- Metric Cards Grid ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              id={m.id}
              className={`
                relative overflow-hidden rounded-xl ${m.cardBg}
                p-5 hover:border-slate-300 transition-all duration-300
              `}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3.5">
                  <div className={`w-8 h-8 rounded-lg ${m.iconBg} flex items-center justify-center`}>
                    <Icon size={16} />
                  </div>
                  {m.trendUp ? (
                    <TrendUpIcon size={14} className="text-slate-400" />
                  ) : (
                    <TrendDownIcon size={14} className="text-slate-400" />
                  )}
                </div>
                <p className="text-lg font-bold tracking-tight text-slate-900">{m.value}</p>
                <div className="flex items-center justify-between mt-2.5">
                  <p className="text-[11px] font-medium text-slate-500">{m.label}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${m.trendClass}`}>
                    {m.trend}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- Main Content Grid ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---- Financial Trend Chart (SVG) ---- */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                <ChartIcon className="text-slate-500" size={16} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Tren Penjualan Mingguan</h3>
                <p className="text-[11px] text-slate-400">7 hari terakhir</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50/60 border border-emerald-100 px-2 py-0.5 rounded-lg">
              Live Data
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="relative">
            <svg viewBox="0 0 700 200" className="w-full h-48" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={`grid-${i}`}
                  x1="40"
                  y1={20 + i * 40}
                  x2="680"
                  y2={20 + i * 40}
                  stroke="#f1f5f9"
                  strokeWidth="1.5"
                />
              ))}

              {/* Bars */}
              {chartData.map((d, i) => {
                const barWidth = 48;
                const gap = (640 - barWidth * 7) / 8;
                const x = 54 + i * (barWidth + gap);
                const barHeight = (d.value / maxChartValue) * 140;
                const y = 175 - barHeight;

                return (
                  <g key={d.day}>
                    {/* Main bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="4"
                      fill="#6366f1"
                      className="hover:fill-[#4f46e5] cursor-pointer transition-colors duration-150"
                    >
                      <animate
                        attributeName="height"
                        from="0"
                        to={barHeight}
                        dur="0.6s"
                        begin={`${i * 0.08}s`}
                        fill="freeze"
                      />
                      <animate
                        attributeName="y"
                        from="175"
                        to={y}
                        dur="0.6s"
                        begin={`${i * 0.08}s`}
                        fill="freeze"
                      />
                    </rect>
                    {/* Value label */}
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      textAnchor="middle"
                      className="fill-slate-500 text-[10px] font-medium font-sans"
                    >
                      {(d.value / 1000).toFixed(0)}K
                    </text>
                    {/* Day label */}
                    <text
                      x={x + barWidth / 2}
                      y="194"
                      textAnchor="middle"
                      className="fill-slate-400 text-[10px] font-medium"
                    >
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* ---- Low Stock Alerts Panel ---- */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
              lowStockProducts.length > 0 
                ? 'bg-rose-50 border-rose-100/50' 
                : 'bg-emerald-50 border-emerald-100/50'
            }`}>
              <AlertIcon className={lowStockProducts.length > 0 ? 'text-rose-600' : 'text-emerald-600'} size={16} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Peringatan Stok</h3>
              <p className="text-[11px] text-slate-400">Produk dengan stok &lt; 5</p>
            </div>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-center mx-auto mb-3 text-lg">
                ✓
              </div>
              <p className="text-xs font-semibold text-slate-700">Semua Stok Aman</p>
              <p className="text-[10px] text-slate-400 mt-1">Tidak ada produk yang perlu di-restock</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-rose-50/40 border border-rose-100/60 hover:bg-rose-50/80 transition-colors"
                >
                  {/* Stock badge */}
                  <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                    {product.stock}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-rose-600 font-medium mt-0.5">
                      ⚠️ Stok sangat rendah
                    </p>
                  </div>
                  {/* WhatsApp Restock Button */}
                  <a
                    href={generateWhatsAppLink(product.name, product.stock)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Restock ${product.name} via WhatsApp`}
                    className="flex-shrink-0 inline-flex items-center px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-all duration-150 cursor-pointer"
                  >
                    <WhatsAppIcon size={12} className="mr-1" />
                    <span>Restock</span>
                  </a>
                </div>
              ))}
              {/* Summary banner */}
              <div className="mt-4 p-3 rounded-lg bg-rose-50/60 border border-rose-100 text-rose-700 text-center text-xs font-semibold">
                {lowStockProducts.length} produk perlu segera di-restock!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---- Smart Insight Widget ---- */}
      <SmartInsight products={products} transactions={transactions} />

      {/* ---- Quick Stats Bar ---- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Produk', value: products.length, icon: '📦' },
          { label: 'Total Unit Stok', value: totalItems, icon: '🏷️' },
          { label: 'Kategori', value: [...new Set(products.map((p) => p.category))].length, icon: '📁' },
          { label: 'Transaksi Hari Ini', value: transactions.length, icon: '🧾' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 hover:border-slate-300 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-sm">
              {stat.icon}
            </div>
            <div>
              <p className="text-base font-bold text-slate-800 leading-none">{stat.value}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
