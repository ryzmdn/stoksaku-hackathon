// ============================================
// StokSaku — Buku Kasbon (Credit Book)
// Lightweight customer debt/credit tracker
// ============================================

import React, { useState } from 'react';
import type { Kasbon } from '../types';
import { formatRupiah, generateId } from '../data';
import {
  PlusIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
  SearchIcon,
  LedgerIcon,
} from './Icons';

// ---- Initial Dummy Data ----
const INITIAL_KASBON: Kasbon[] = [
  {
    id: generateId(),
    customerName: 'Budi Santoso',
    amount: 125000,
    date: new Date(2026, 4, 28),
    status: 'Belum Lunas',
  },
  {
    id: generateId(),
    customerName: 'Siti Rahmawati',
    amount: 75000,
    date: new Date(2026, 4, 25),
    status: 'Lunas',
  },
  {
    id: generateId(),
    customerName: 'Andi Pratama',
    amount: 200000,
    date: new Date(2026, 4, 29),
    status: 'Belum Lunas',
  },
];

const BukuKasbon: React.FC = () => {
  // ---- State ----
  const [kasbonList, setKasbonList] = useState<Kasbon[]>(INITIAL_KASBON);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formAmount, setFormAmount] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'Belum Lunas' | 'Lunas'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ---- CRUD Handlers ----

  /** Add a new kasbon record */
  const addKasbon = (name: string, amount: number) => {
    if (!name.trim() || amount <= 0) return;
    const newKasbon: Kasbon = {
      id: generateId(),
      customerName: name.trim(),
      amount,
      date: new Date(),
      status: 'Belum Lunas',
    };
    setKasbonList((prev) => [newKasbon, ...prev]);
    setFormName('');
    setFormAmount(0);
    setShowForm(false);
  };

  /** Toggle payment status between Lunas / Belum Lunas */
  const togglePayStatus = (id: string) => {
    setKasbonList((prev) =>
      prev.map((k) =>
        k.id === id
          ? { ...k, status: k.status === 'Lunas' ? 'Belum Lunas' : 'Lunas' }
          : k
      )
    );
  };

  /** Delete a kasbon record */
  const deleteKasbon = (id: string) => {
    setKasbonList((prev) => prev.filter((k) => k.id !== id));
    setDeleteConfirm(null);
  };

  // ---- Derived Data ----
  const filtered = kasbonList.filter((k) => {
    const matchSearch =
      k.customerName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || k.status === filter;
    return matchSearch && matchFilter;
  });

  const totalUnpaid = kasbonList
    .filter((k) => k.status === 'Belum Lunas')
    .reduce((sum, k) => sum + k.amount, 0);
  const totalPaid = kasbonList
    .filter((k) => k.status === 'Lunas')
    .reduce((sum, k) => sum + k.amount, 0);
  const unpaidCount = kasbonList.filter((k) => k.status === 'Belum Lunas').length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* ---- Page Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Buku Kasbon
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Catatan hutang pelanggan — kelola piutang UMKM Anda
          </p>
        </div>
        <button
          id="btn-add-kasbon"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition-colors duration-150 cursor-pointer"
        >
          <PlusIcon size={14} />
          Tambah Kasbon
        </button>
      </div>

      {/* ---- Summary Cards ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Unpaid */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 transition-all duration-300">
          <div>
            <p className="text-[11px] font-medium text-slate-500 mb-1">Total Belum Lunas</p>
            <p className="text-lg font-bold text-slate-900">{formatRupiah(totalUnpaid)}</p>
            <span className="text-[10px] px-2 py-0.5 rounded border border-amber-100 bg-amber-50/60 text-amber-700 font-semibold mt-2 inline-block">
              {unpaidCount} catatan
            </span>
          </div>
        </div>
        {/* Paid */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 transition-all duration-300">
          <div>
            <p className="text-[11px] font-medium text-slate-500 mb-1">Total Lunas</p>
            <p className="text-lg font-bold text-slate-900">{formatRupiah(totalPaid)}</p>
            <span className="text-[10px] px-2 py-0.5 rounded border border-emerald-100 bg-emerald-50/60 text-emerald-700 font-semibold mt-2 inline-block">
              {kasbonList.length - unpaidCount} catatan
            </span>
          </div>
        </div>
        {/* Total */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 transition-all duration-300">
          <div>
            <p className="text-[11px] font-medium text-slate-500 mb-1">Total Semua Kasbon</p>
            <p className="text-lg font-bold text-slate-900">{formatRupiah(totalUnpaid + totalPaid)}</p>
            <span className="text-[10px] px-2 py-0.5 rounded border border-slate-100 bg-slate-50 text-slate-500 font-semibold mt-2 inline-block">
              {kasbonList.length} catatan
            </span>
          </div>
        </div>
      </div>

      {/* ---- Search & Filter Bar ---- */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            id="search-kasbon"
            type="text"
            placeholder="Cari nama pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'Belum Lunas', 'Lunas'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filter === f
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              {f === 'all' ? 'Semua' : f}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Kasbon List ---- */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-3">
              <LedgerIcon className="text-slate-400" size={20} />
            </div>
            <p className="text-xs font-semibold text-slate-500">Tidak ada catatan kasbon</p>
            <p className="text-[10px] text-slate-400 mt-1">Tambah kasbon baru atau ubah filter pencarian</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((kasbon) => {
              const isPaid = kasbon.status === 'Lunas';
              return (
                <div
                  key={kasbon.id}
                  className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Status indicator */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${
                    isPaid
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                      : 'bg-amber-50 border-amber-100 text-amber-700'
                  }`}>
                    {isPaid ? '✓' : '!'}
                  </div>

                  {/* Customer info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{kasbon.customerName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {kasbon.date.toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className={`text-xs font-bold ${isPaid ? 'text-slate-400 line-through' : 'text-amber-700'}`}>
                      {formatRupiah(kasbon.amount)}
                    </p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border mt-1.5 ${
                      isPaid
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                        : 'bg-amber-50 border-amber-100 text-amber-700'
                    }`}>
                      {kasbon.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      onClick={() => togglePayStatus(kasbon.id)}
                      title={isPaid ? 'Tandai belum lunas' : 'Tandai lunas'}
                      className="p-1.5 rounded hover:bg-slate-50 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      <CheckIcon size={14} />
                    </button>
                    {deleteConfirm === kasbon.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => deleteKasbon(kasbon.id)}
                          className="px-2 py-1 text-[10px] font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors cursor-pointer"
                        >
                          Ya
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition-colors cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(kasbon.id)}
                        className="p-1.5 rounded hover:bg-slate-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Hapus kasbon"
                      >
                        <TrashIcon size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer summary */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200/60 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Menampilkan <strong className="text-slate-700">{filtered.length}</strong> dari{' '}
            <strong className="text-slate-700">{kasbonList.length}</strong> catatan
          </p>
          {unpaidCount > 0 && (
            <p className="text-[11px] font-semibold text-amber-700">
              {unpaidCount} belum lunas
            </p>
          )}
        </div>
      </div>

      {/* ---- Add Kasbon Modal ---- */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md animate-fade-in-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Tambah Kasbon Baru</h3>
                <p className="text-xs text-slate-400 mt-0.5">Catat hutang pelanggan baru</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <XIcon size={16} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addKasbon(formName, formAmount);
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Nama Pelanggan <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-kasbon-name"
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="mis. Budi Santoso"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Jumlah (Rp) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-kasbon-amount"
                  type="number"
                  min="1"
                  required
                  value={formAmount || ''}
                  onChange={(e) => setFormAmount(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Preview */}
              {formName && formAmount > 0 && (
                <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100 text-xs text-amber-700">
                  <p className="font-medium">
                    📝 <strong>{formName}</strong> akan tercatat berhutang <strong>{formatRupiah(formAmount)}</strong>
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  id="btn-submit-kasbon"
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BukuKasbon;
