import React from 'react';
import type { Transaction } from '../types';
import { formatRupiah } from '../data';

interface ReceiptTemplateProps {
  transaction: Transaction;
}

/**
 * Triggers the browser print dialog
 */
export const printReceipt = () => {
  window.print();
};

/**
 * ReceiptTemplate Component
 * Designed to be printed on standard receipt printers or saved as PDF.
 * Uses font-mono for classic receipt style.
 */
export const ReceiptTemplate: React.FC<ReceiptTemplateProps> = ({ transaction }) => {
  const formattedDate = new Date(transaction.timestamp).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div
      id="receipt-print-area"
      className="hidden print:block bg-white p-6 max-w-xs mx-auto text-black border border-dashed border-slate-400 font-mono text-sm leading-relaxed"
    >
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider">Warung StokSaku</h2>
        <p className="text-[11px] text-slate-500 mt-1">Sistem POS UMKM Pintar</p>
        <p className="text-[10px] text-slate-500">Jl. Pembangunan No. 8, Jakarta</p>
      </div>

      <div className="border-t border-b border-dashed border-slate-300 py-3 mb-4 space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-600">ID Transaksi:</span>
          <span className="font-semibold text-slate-900">{transaction.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Waktu:</span>
          <span className="font-semibold text-slate-900">{formattedDate}</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex justify-between">
          <span>Item</span>
          <span>Subtotal</span>
        </div>
        {transaction.items.map((item) => (
          <div key={item.product.id} className="text-xs">
            <div className="flex justify-between font-medium text-slate-800">
              <span className="truncate pr-4">{item.product.name}</span>
              <span className="font-semibold">{formatRupiah(item.product.sellPrice * item.qty)}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {item.qty} x {formatRupiah(item.product.sellPrice)}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-slate-300 pt-4 mb-6 space-y-2">
        <div className="flex justify-between text-base font-bold text-slate-950">
          <span>Total</span>
          <span>{formatRupiah(transaction.total)}</span>
        </div>
      </div>

      <div className="text-center border-t border-dashed border-slate-200 pt-4 mt-4">
        <p className="text-xs font-bold text-slate-800">Terima Kasih</p>
        <p className="text-[10px] text-slate-500 mt-0.5">Sudah berbelanja di toko kami</p>
        <p className="text-[9px] text-slate-400 mt-2 tracking-widest font-sans uppercase">StokSaku POS</p>
      </div>
    </div>
  );
};
