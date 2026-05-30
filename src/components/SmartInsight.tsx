// ============================================
// StokSaku — Smart Insight Widget
// AI-style stock prediction card for Dashboard
// ============================================

import React, { useMemo } from 'react';
import type { Product, Transaction } from '../types';
import { analyzeAllProducts, type RunoutResult } from '../utils/prediction';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { AlertIcon, WhatsAppIcon, TrendDownIcon } from './Icons';

interface SmartInsightProps {
  products: Product[];
  transactions: Transaction[];
}

/** Risk level color/style mappings */
const RISK_STYLES = {
  high: {
    label: 'Risiko Tinggi',
    badge: 'bg-rose-50 border border-rose-100 text-rose-700',
    bar: 'bg-rose-600',
    barBg: 'bg-slate-100',
    percent: 90,
  },
  medium: {
    label: 'Risiko Sedang',
    badge: 'bg-amber-50 border border-amber-100 text-amber-700',
    bar: 'bg-amber-500',
    barBg: 'bg-slate-100',
    percent: 55,
  },
  low: {
    label: 'Risiko Rendah',
    badge: 'bg-emerald-50 border border-emerald-100 text-emerald-700',
    bar: 'bg-emerald-600',
    barBg: 'bg-slate-100',
    percent: 20,
  },
};

const SmartInsight: React.FC<SmartInsightProps> = ({ products, transactions }) => {
  // Analyze all products for runout predictions
  const predictions = useMemo(
    () => analyzeAllProducts(products, transactions),
    [products, transactions]
  );

  // Top 3 most at-risk products
  const topRisks = predictions.slice(0, 3);
  const mostDangerous = topRisks[0] as RunoutResult | undefined;

  // Count by risk level
  const riskCounts = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    predictions.forEach((p) => counts[p.risk]++);
    return counts;
  }, [predictions]);

  if (!mostDangerous) return null;

  const topStyle = RISK_STYLES[mostDangerous.risk];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-300">
      {/* ---- Header ---- */}
      <div className="relative px-6 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-sm">
              🧠
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Smart Insight</h3>
              <p className="text-[11px] text-slate-400">Prediksi Stok Otomatis</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold tracking-wide uppercase text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-150">
            AI-Powered
          </span>
        </div>
      </div>

      {/* ---- Most At-Risk Product ---- */}
      <div className="px-6 pb-4">
        <div className={`p-4 rounded-lg border ${
          mostDangerous.risk === 'high'
            ? 'bg-rose-50/40 border-rose-100/60'
            : mostDangerous.risk === 'medium'
              ? 'bg-amber-50/40 border-amber-100/60'
              : 'bg-emerald-50/40 border-emerald-100/60'
        }`}>
          {/* Product name & risk badge */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Paling Berisiko
              </p>
              <p className="text-sm font-bold text-slate-800 truncate">
                {mostDangerous.product.name}
              </p>
            </div>
            <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${topStyle.badge}`}>
              {topStyle.label}
            </span>
          </div>

          {/* Gauge Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-500 font-medium">Tingkat Risiko</span>
              <span className="text-[10px] font-bold text-slate-600">{topStyle.percent}%</span>
            </div>
            <div className={`w-full h-2 rounded-full ${topStyle.barBg} overflow-hidden`}>
              <div
                className={`h-full rounded-full ${topStyle.bar} transition-all duration-1000 ease-out`}
                style={{ width: `${topStyle.percent}%` }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Sisa stok:</span>
              <span className="text-xs font-bold text-slate-800">{mostDangerous.product.stock} pcs</span>
            </div>
            {mostDangerous.dailyRate > 0 && (
              <div className="flex items-center gap-1.5">
                <TrendDownIcon size={12} className="text-slate-400" />
                <span className="text-[11px] text-slate-500">{mostDangerous.dailyRate} unit/hari</span>
              </div>
            )}
            {mostDangerous.daysLeft !== Infinity && mostDangerous.daysLeft > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500">Habis dalam:</span>
                <span className={`text-xs font-bold ${
                  mostDangerous.daysLeft <= 3 ? 'text-rose-600' : 'text-slate-800'
                }`}>
                  ~{mostDangerous.daysLeft} hari
                </span>
              </div>
            )}
          </div>

          {/* Recommendation */}
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white border border-slate-200/50">
            <AlertIcon size={14} className="text-slate-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              {mostDangerous.recommendation}
            </p>
          </div>

          {/* Quick restock action */}
          {mostDangerous.risk !== 'low' && (
            <a
              href={generateWhatsAppLink(mostDangerous.product.name, mostDangerous.product.stock)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors duration-155 cursor-pointer"
            >
              <WhatsAppIcon size={14} className="text-white" />
              <span>Hubungi Supplier Sekarang</span>
            </a>
          )}
        </div>
      </div>

      {/* ---- Other At-Risk Products ---- */}
      {topRisks.length > 1 && (
        <div className="px-6 pb-5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Produk Lain yang Perlu Diperhatikan
          </p>
          <div className="space-y-2">
            {topRisks.slice(1).map((item) => {
              const style = RISK_STYLES[item.risk];
              return (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100/60 hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {item.daysLeft === Infinity
                        ? 'Belum ada data'
                        : `~${item.daysLeft} hari tersisa • {item.product.stock} pcs`
                      }
                    </p>
                  </div>
                  {/* Mini gauge */}
                  <div className="w-16 flex-shrink-0">
                    <div className={`w-full h-1.5 rounded-full ${style.barBg} overflow-hidden`}>
                      <div
                        className={`h-full rounded-full ${style.bar}`}
                        style={{ width: `${style.percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- Risk Summary Footer ---- */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200/60 flex items-center justify-between">
        <p className="text-[10px] text-slate-400 font-medium">Analisis dari {predictions.length} produk</p>
        <div className="flex items-center gap-2">
          {riskCounts.high > 0 && (
            <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">Tinggi: {riskCounts.high}</span>
          )}
          {riskCounts.medium > 0 && (
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded">Sedang: {riskCounts.medium}</span>
          )}
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">Rendah: {riskCounts.low}</span>
        </div>
      </div>
    </div>
  );
};

export default SmartInsight;
