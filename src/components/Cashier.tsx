// ============================================
// StokSaku — Smart Cashier / POS Interface
// Left: Product grid | Right: Cart checkout
// ============================================

import React, { useState } from 'react';
import type { Product, CartItem, Transaction } from '../types';
import { formatRupiah, generateId } from '../data';
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CartIcon,
  SearchIcon,
  CheckIcon,
  XIcon,
  AlertIcon,
} from './Icons';
import { ReceiptTemplate, printReceipt } from './ReceiptTemplate';

interface CashierProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onTransaction: (transaction: Transaction) => void;
}

const Cashier: React.FC<CashierProps> = ({ products, setProducts, onTransaction }) => {
  // ---- Local State ----
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  // ---- Derived Data ----
  const categories = ['Semua', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const subtotal = cart.reduce((sum, item) => sum + item.product.sellPrice * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  // ---- Cart Operations ----
  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        // Don't exceed available stock
        if (existing.qty >= product.stock) return prev;
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id !== productId) return item;
          const newQty = item.qty + delta;
          // Prevent exceeding stock
          const product = products.find((p) => p.id === productId);
          if (product && newQty > product.stock) return item;
          return { ...item, qty: newQty };
        })
        .filter((item) => item.qty > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  // ---- Process Transaction ----
  const processTransaction = () => {
    if (cart.length === 0) return;

    // 1. Deduct stock from products
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((item) => item.product.id === p.id);
        if (cartItem) {
          return { ...p, stock: p.stock - cartItem.qty };
        }
        return p;
      })
    );

    // 2. Record transaction
    const transaction: Transaction = {
      id: generateId(),
      items: [...cart],
      total: subtotal,
      timestamp: new Date(),
    };
    onTransaction(transaction);
    setLastTransaction(transaction);

    // 3. Clear cart & show success
    setCart([]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 8000);
  };

  // ---- Get cart qty for a product ----
  const getCartQty = (productId: string) => {
    return cart.find((item) => item.product.id === productId)?.qty || 0;
  };

  return (
    <div className="animate-fade-in-up">
      {/* ---- Page Header ---- */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Kasir Pintar
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          Point of Sale — Transaksi cepat dan otomatis
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ======== LEFT: Product Grid ======== */}
        <div className="flex-1 min-w-0">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                id="cashier-search"
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-150"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer
                    ${selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-500 hover:text-indigo-600'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock <= 0;
              const isLowStock = product.stock > 0 && product.stock < 5;
              const inCart = getCartQty(product.id);
              const remainingStock = product.stock - inCart;

              return (
                <button
                  key={product.id}
                  id={`pos-product-${product.id}`}
                  onClick={() => addToCart(product)}
                  disabled={isOutOfStock || remainingStock <= 0}
                  className="relative group text-left p-4 bg-white border border-slate-200 rounded-lg transition-all duration-150 cursor-pointer disabled:bg-slate-50 disabled:border-slate-200 disabled:opacity-60 disabled:cursor-not-allowed hover:border-indigo-500"
                >
                  {/* Cart quantity badge */}
                  {inCart > 0 && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center z-10">
                      {inCart}
                    </div>
                  )}

                  {/* Product icon area */}
                  <div className={`
                    w-full aspect-square rounded-lg mb-3 flex items-center justify-center text-2xl border
                    ${isOutOfStock
                      ? 'bg-slate-100 border-slate-200/60'
                      : isLowStock
                        ? 'bg-rose-50 border-rose-100'
                        : 'bg-slate-50 border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100'
                    }
                  `}>
                    {product.category === 'Streetwear' && '👕'}
                    {product.category === 'Makanan Ringan' && '🍿'}
                    {product.category === 'Aksesoris' && '🧢'}
                    {product.category === 'Minuman' && '🥤'}
                    {!['Streetwear', 'Makanan Ringan', 'Aksesoris', 'Minuman'].includes(product.category) && '📦'}
                  </div>

                  {/* Product info */}
                  <h4 className="text-xs font-semibold text-slate-800 leading-tight line-clamp-2 mb-1">
                    {product.name}
                  </h4>
                  <p className="text-xs font-bold text-slate-900">
                    {formatRupiah(product.sellPrice)}
                  </p>

                  {/* Stock indicator */}
                  <div className="mt-2.5 flex items-center gap-1.5">
                    {isOutOfStock ? (
                      <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        Habis
                      </span>
                    ) : isLowStock ? (
                      <span className="text-[9px] font-semibold text-rose-700 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">
                        Sisa {remainingStock}
                      </span>
                    ) : (
                      <span className="text-[9px] font-medium text-slate-400">
                        Stok: {remainingStock}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <p className="text-xs text-slate-400">Tidak ada produk ditemukan</p>
              </div>
            )}
          </div>
        </div>

        {/* ======== RIGHT: Cart / Checkout ======== */}
        <div className="w-full lg:w-80 lg:flex-shrink-0">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden sticky top-4">
            {/* Cart Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                    <CartIcon size={14} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs">Keranjang</h3>
                    <p className="text-[10px] text-slate-400">{totalItems} item</p>
                  </div>
                </div>
                {cart.length > 0 && (
                  <button
                    id="btn-clear-cart"
                    onClick={clearCart}
                    className="text-[10px] text-rose-600 font-semibold hover:text-rose-700 transition-colors px-2 py-1 rounded hover:bg-rose-50 cursor-pointer"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>

            {/* Cart Items */}
            <div className="max-h-80 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="py-12 text-center px-4">
                  <div className="w-12 h-12 rounded bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-300">
                    <CartIcon size={20} />
                  </div>
                  <p className="text-xs font-semibold text-slate-400">Keranjang Kosong</p>
                  <p className="text-[10px] text-slate-300 mt-0.5">Klik produk untuk menambahkan</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 p-3.5 hover:bg-slate-50/50 transition-colors animate-slide-in-right"
                    >
                      {/* Item info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {formatRupiah(item.product.sellPrice)} × {item.qty}
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQty(item.product.id, -1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                        >
                          <MinusIcon size={10} />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-slate-800">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.product.id, 1)}
                          disabled={item.qty >= item.product.stock}
                          className="w-6 h-6 rounded bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <PlusIcon size={10} />
                        </button>
                      </div>

                      {/* Item total & remove */}
                      <div className="text-right ml-1">
                        <p className="text-xs font-bold text-slate-800">
                          {formatRupiah(item.product.sellPrice * item.qty)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[9px] text-rose-500 hover:text-rose-700 font-medium transition-colors mt-0.5 cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkout Summary */}
            {cart.length > 0 && (
              <div className="border-t border-slate-200 p-4 space-y-3 bg-slate-50">
                {/* Summary rows */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Subtotal ({totalItems} item)</span>
                    <span className="font-semibold text-slate-700">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Pajak</span>
                    <span className="font-medium text-emerald-700">Rp 0</span>
                  </div>
                  <hr className="border-slate-200/60" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-semibold text-slate-700">Total</span>
                    <span className="text-base font-bold text-indigo-600">
                      {formatRupiah(subtotal)}
                    </span>
                  </div>
                </div>

                {/* Low stock warnings in cart */}
                {cart.some((item) => {
                  const product = products.find((p) => p.id === item.product.id);
                  return product && product.stock - item.qty < 5;
                }) && (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50/60 border border-amber-100">
                    <AlertIcon className="text-amber-600 flex-shrink-0 mt-0.5" size={12} />
                    <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                      Beberapa produk akan memiliki stok rendah setelah transaksi ini.
                    </p>
                  </div>
                )}

                {/* Process Button */}
                <button
                  id="btn-process-transaction"
                  onClick={processTransaction}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckIcon size={14} />
                  Proses Transaksi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---- Success Toast ---- */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
          <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 text-slate-800 rounded-lg shadow-lg">
            <div className="w-7 h-7 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckIcon size={14} />
            </div>
            <div>
              <p className="font-semibold text-xs text-slate-800">Transaksi Berhasil</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Stok diperbarui otomatis</p>
            </div>
            {lastTransaction && (
              <button
                onClick={() => printReceipt()}
                className="ml-4 px-2 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1"
              >
                Cetak
              </button>
            )}
            <button
              onClick={() => setShowSuccess(false)}
              className="ml-1.5 p-1 rounded hover:bg-slate-50 text-slate-400 transition-colors cursor-pointer"
            >
              <XIcon size={14} />
            </button>
          </div>
        </div>
      )}

      {lastTransaction && <ReceiptTemplate transaction={lastTransaction} />}
    </div>
  );
};

export default Cashier;
