// ============================================
// StokSaku — Stock Prediction Utility
// Offline-first linear runout estimation
// ============================================

import type { Product, Transaction } from '../types';

/** Result of a runout calculation for a single product */
export interface RunoutResult {
  product: Product;
  /** Estimated days until stock reaches 0 (Infinity if no sales history) */
  daysLeft: number;
  /** Average units sold per day */
  dailyRate: number;
  /** Risk level based on days remaining */
  risk: 'high' | 'medium' | 'low';
  /** Human-readable recommendation */
  recommendation: string;
}

/**
 * Calculates estimated days before a product runs out
 * using a simple linear consumption rate from transaction history.
 *
 * @param currentStock - Current stock quantity
 * @param salesHistory - Array of { qty, date } sold for this product
 * @returns Estimated days remaining (Infinity if no data)
 */
export function calculateRunoutRate(
  currentStock: number,
  salesHistory: { qty: number; date: Date }[]
): { daysLeft: number; dailyRate: number } {
  if (salesHistory.length === 0 || currentStock <= 0) {
    return {
      daysLeft: currentStock <= 0 ? 0 : Infinity,
      dailyRate: 0,
    };
  }

  // Total units sold
  const totalSold = salesHistory.reduce((sum, s) => sum + s.qty, 0);

  // Time span in days (min 1 day to avoid division by zero)
  const dates = salesHistory.map((s) => s.date.getTime());
  const earliest = Math.min(...dates);
  const latest = Math.max(...dates, Date.now());
  const spanDays = Math.max((latest - earliest) / (1000 * 60 * 60 * 24), 1);

  // Average daily consumption rate
  const dailyRate = totalSold / spanDays;

  if (dailyRate <= 0) {
    return { daysLeft: Infinity, dailyRate: 0 };
  }

  return {
    daysLeft: Math.round(currentStock / dailyRate),
    dailyRate: Math.round(dailyRate * 10) / 10,
  };
}

/**
 * Analyzes all products against transaction history and returns
 * runout predictions sorted by urgency (most at-risk first).
 */
export function analyzeAllProducts(
  products: Product[],
  transactions: Transaction[]
): RunoutResult[] {
  return products
    .map((product) => {
      // Extract sales history for this product from all transactions
      const salesHistory = transactions.flatMap((t) =>
        t.items
          .filter((item) => item.product.id === product.id)
          .map((item) => ({ qty: item.qty, date: t.timestamp }))
      );

      const { daysLeft, dailyRate } = calculateRunoutRate(product.stock, salesHistory);

      // Determine risk level
      let risk: RunoutResult['risk'];
      let recommendation: string;

      if (daysLeft <= 3) {
        risk = 'high';
        recommendation = `Segera pesan ulang! Stok diperkirakan habis dalam ${daysLeft} hari.`;
      } else if (daysLeft <= 7) {
        risk = 'medium';
        recommendation = `Jadwalkan restock dalam ${daysLeft} hari ke depan untuk menghindari kekosongan.`;
      } else if (daysLeft === Infinity) {
        risk = 'low';
        recommendation = 'Belum ada data penjualan. Pantau pergerakan stok secara berkala.';
      } else {
        risk = 'low';
        recommendation = `Stok aman untuk ~${daysLeft} hari ke depan dengan rata-rata ${dailyRate} unit/hari.`;
      }

      return { product, daysLeft, dailyRate, risk, recommendation };
    })
    .sort((a, b) => {
      // Sort: high risk first, then medium, then low
      const riskOrder = { high: 0, medium: 1, low: 2 };
      if (riskOrder[a.risk] !== riskOrder[b.risk]) {
        return riskOrder[a.risk] - riskOrder[b.risk];
      }
      // Within same risk, sort by fewer days left
      return a.daysLeft - b.daysLeft;
    });
}
