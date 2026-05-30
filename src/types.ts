// ============================================
// StokSaku — Type Definitions
// ============================================

/** Represents a single product in inventory */
export interface Product {
  id: string;
  name: string;
  category: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
}

/** Represents a single item in the shopping cart */
export interface CartItem {
  product: Product;
  qty: number;
}

/** Represents a completed transaction */
export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
}

/** Represents a customer credit/debt record (kasbon) */
export interface Kasbon {
  id: string;
  customerName: string;
  amount: number;
  date: Date;
  status: 'Belum Lunas' | 'Lunas';
}

/** Navigation page identifiers */
export type Page = 'dashboard' | 'stock' | 'cashier' | 'kasbon';
