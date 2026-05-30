// ============================================
// StokSaku — Stock Management (CRUD)
// Professional data table with Add/Edit/Delete
// ============================================

import React, { useState } from 'react';
import type { Product } from '../types';
import { formatRupiah, generateId, CATEGORIES } from '../data';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  SearchIcon,
  AlertIcon,
  BoxIcon,
} from './Icons';

interface StockManagementProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

/** Empty product form state */
const emptyForm = (): Omit<Product, 'id'> => ({
  name: '',
  category: CATEGORIES[0],
  buyPrice: 0,
  sellPrice: 0,
  stock: 0,
});

const StockManagement: React.FC<StockManagementProps> = ({ products, setProducts }) => {
  // ---- Local UI State ----
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyForm());
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ---- Filtered products ----
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  // ---- Handlers ----
  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      buyPrice: product.buyPrice,
      sellPrice: product.sellPrice,
      stock: product.stock,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingId) {
      // Update existing product
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...p, ...form } : p
        )
      );
    } else {
      // Add new product
      const newProduct: Product = { id: generateId(), ...form };
      setProducts((prev) => [...prev, newProduct]);
    }

    setShowModal(false);
    setForm(emptyForm());
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const lowStockCount = products.filter((p) => p.stock < 5).length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* ---- Page Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Manajemen Stok
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Kelola inventaris produk UMKM Anda
          </p>
        </div>
        <button
          id="btn-add-product"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition-colors duration-150 cursor-pointer"
        >
          <PlusIcon size={14} />
          Tambah Produk
        </button>
      </div>

      {/* ---- Low Stock Warning Banner ---- */}
      {lowStockCount > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-rose-50/40 border border-rose-100">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 flex items-center justify-center">
            <AlertIcon size={16} />
          </div>
          <div>
            <p className="text-xs font-semibold text-rose-800">
              {lowStockCount} produk memiliki stok di bawah 5 unit!
            </p>
            <p className="text-[11px] text-rose-600 mt-0.5">
              Segera lakukan restock untuk menghindari kekosongan stok.
            </p>
          </div>
        </div>
      )}

      {/* ---- Search Bar ---- */}
      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
        <input
          id="search-products"
          type="text"
          placeholder="Cari produk atau kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-150"
        />
      </div>

      {/* ---- Data Table ---- */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/60">
                <th className="text-left py-3 px-4 font-semibold text-slate-600 text-[10px] tracking-wider uppercase">
                  Produk
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600 text-[10px] tracking-wider uppercase hidden sm:table-cell">
                  Kategori
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600 text-[10px] tracking-wider uppercase">
                  Harga Beli
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600 text-[10px] tracking-wider uppercase">
                  Harga Jual
                </th>
                <th className="text-center py-3 px-4 font-semibold text-slate-600 text-[10px] tracking-wider uppercase">
                  Stok
                </th>
                <th className="text-center py-3 px-4 font-semibold text-slate-600 text-[10px] tracking-wider uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-3">
                      <BoxIcon className="text-slate-400" size={20} />
                    </div>
                    <p className="text-xs font-semibold text-slate-500">Tidak ada produk ditemukan</p>
                    <p className="text-[10px] text-slate-400 mt-1">Coba ubah kata kunci pencarian Anda</p>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const isLow = product.stock < 5;
                  const margin = product.sellPrice - product.buyPrice;
                  return (
                    <tr
                      key={product.id}
                      className={`
                        hover:bg-slate-50/50 transition-colors group
                        ${isLow ? 'bg-rose-50/10' : ''}
                      `}
                    >
                      {/* Product Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                            isLow
                              ? 'bg-rose-50 border border-rose-100 text-rose-700'
                              : 'bg-indigo-50 border border-slate-150 text-indigo-700'
                          }`}>
                            {product.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{product.name}</p>
                            <p className="text-[10px] text-emerald-700 font-medium sm:hidden mt-0.5">
                              {product.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200/50">
                          {product.category}
                        </span>
                      </td>

                      {/* Buy Price */}
                      <td className="py-3 px-4 text-right text-slate-600 font-medium">
                        {formatRupiah(product.buyPrice)}
                      </td>

                      {/* Sell Price */}
                      <td className="py-3 px-4 text-right">
                        <p className="font-semibold text-slate-800">{formatRupiah(product.sellPrice)}</p>
                        <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
                          +{formatRupiah(margin)} margin
                        </p>
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4 text-center">
                        <span className={`
                          inline-flex items-center justify-center min-w-[2.25rem] px-2 py-0.5 rounded text-[11px] font-semibold border
                          ${isLow
                            ? 'bg-rose-50 border-rose-100 text-rose-700'
                            : product.stock < 10
                              ? 'bg-amber-50 border-amber-100 text-amber-700'
                              : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          }
                        `}>
                          {product.stock}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            id={`btn-edit-${product.id}`}
                            onClick={() => openEditModal(product)}
                            className="p-1.5 rounded hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                            title="Edit produk"
                          >
                            <EditIcon size={14} />
                          </button>
                          {deleteConfirm === product.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(product.id)}
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
                              id={`btn-delete-${product.id}`}
                              onClick={() => setDeleteConfirm(product.id)}
                              className="p-1.5 rounded hover:bg-slate-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Hapus produk"
                            >
                              <TrashIcon size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer summary */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200/60 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Menampilkan <strong className="text-slate-700">{filtered.length}</strong> dari{' '}
            <strong className="text-slate-700">{products.length}</strong> produk
          </p>
          <p className="text-[11px] text-slate-500">
            Total stok: <strong className="text-slate-700">{products.reduce((s, p) => s + p.stock, 0)}</strong> unit
          </p>
        </div>
      </div>

      {/* ---- Add/Edit Modal ---- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md animate-fade-in-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingId ? 'Perbarui informasi produk' : 'Isi detail produk baru Anda'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <XIcon size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Nama Produk <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-product-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="mis. Kaos Oversize Premium"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Kategori
                </label>
                <select
                  id="input-category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Prices Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Harga Beli (Rp)
                  </label>
                  <input
                    id="input-buy-price"
                    type="number"
                    min="0"
                    required
                    value={form.buyPrice || ''}
                    onChange={(e) => setForm({ ...form, buyPrice: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Harga Jual (Rp)
                  </label>
                  <input
                    id="input-sell-price"
                    type="number"
                    min="0"
                    required
                    value={form.sellPrice || ''}
                    onChange={(e) => setForm({ ...form, sellPrice: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Jumlah Stok
                </label>
                <input
                  id="input-stock"
                  type="number"
                  min="0"
                  required
                  value={form.stock || ''}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Margin preview */}
              {form.sellPrice > 0 && form.buyPrice > 0 && (
                <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-700">
                  <p className="font-medium">
                    💰 Estimasi margin: <strong>{formatRupiah(form.sellPrice - form.buyPrice)}</strong> per unit
                    {' '}({((form.sellPrice - form.buyPrice) / form.buyPrice * 100).toFixed(1)}%)
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  id="btn-submit-product"
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  {editingId ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
