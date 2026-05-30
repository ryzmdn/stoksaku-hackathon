// ============================================
// StokSaku — Initial Dummy Data
// Realistic UMKM products (streetwear & snacks)
// 2 items have stock < 5 to trigger low-stock alerts
// ============================================

import type { Product } from './types';

/** Generate a unique ID */
export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

/** Initial product catalog for demo */
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: generateId(),
    name: 'Kaos Oversize "Urban Vibes"',
    category: 'Streetwear',
    buyPrice: 45000,
    sellPrice: 89000,
    stock: 24,
  },
  {
    id: generateId(),
    name: 'Hoodie Fleece Premium',
    category: 'Streetwear',
    buyPrice: 85000,
    sellPrice: 175000,
    stock: 12,
  },
  {
    id: generateId(),
    name: 'Keripik Singkong Balado',
    category: 'Makanan Ringan',
    buyPrice: 8000,
    sellPrice: 15000,
    stock: 3, // ⚠️ Low stock!
  },
  {
    id: generateId(),
    name: 'Topi Snapback Logo Custom',
    category: 'Aksesoris',
    buyPrice: 25000,
    sellPrice: 55000,
    stock: 18,
  },
  {
    id: generateId(),
    name: 'Makaroni Pedas Level 5',
    category: 'Makanan Ringan',
    buyPrice: 5000,
    sellPrice: 12000,
    stock: 2, // ⚠️ Low stock!
  },
  {
    id: generateId(),
    name: 'Celana Cargo Wide-Leg',
    category: 'Streetwear',
    buyPrice: 70000,
    sellPrice: 145000,
    stock: 9,
  },
  {
    id: generateId(),
    name: 'Totebag Canvas "Stay Cool"',
    category: 'Aksesoris',
    buyPrice: 18000,
    sellPrice: 42000,
    stock: 30,
  },
];

/** Format number as Indonesian Rupiah */
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/** Product category options */
export const CATEGORIES = [
  'Streetwear',
  'Makanan Ringan',
  'Aksesoris',
  'Minuman',
  'Lainnya',
];
