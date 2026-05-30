# 📦 StokSaku: Smart Cashier & Offline-First Inventory for UMKM

> **Solusi Taktis Digitalisasi Operasional & Manajemen Keuangan Mikro Mandiri guna Mendukung SDG 8: Pekerjaan Layak & Pertumbuhan Ekonomi.** > *Repositori Resmi Aplikasi Web SPA — Kategori Solo Developer (Rizky Ramadhan Putra Darmadi).*

---

## 🎯 Hubungan dengan Target SDG 8

StokSaku dirancang secara spesifik untuk memecahkan hambatan utama dalam **SDG 8 (Pekerjaan Layak & Pertumbuhan Ekonomi)** pada sektor informal di Indonesia:
1. **Digitalisasi & Formalisasi Sektor Mikro (Target 8.3):** Membantu pelaku UMKM (warung kelontong, pakaian, makanan) beralih dari pencatatan kertas konvensional ke sistem inventaris digital tanpa hambatan operasional yang rumit.
2. **Kemandirian Infrastruktur Finansial (Target 8.10):** Dengan pendekatan **Offline-First**, aplikasi tidak bergantung pada koneksi internet atau kuota API eksternal berbayar. Seluruh data sensitif dan operasional tersimpan aman secara lokal di perangkat pengguna.

---

## ✨ Fitur Unggulan & Inovasi Lokal

Aplikasi ini mengimplementasikan prinsip UI/UX modern berbasis **SaaS Enterprise Aesthetic** (menggunakan palet warna *Slate* netral dengan *Muted Accent* merah/hijau halus) untuk meminimalkan *visual noise* dan meningkatkan fokus operasional.

* **⚡ Smart Cashier / Point of Sales (POS):** Antarmuka kasir cepat berbasis komponen reaktif dua kolom. Menambahkan produk ke keranjang belanja cukup dengan sekali ketuk.
* **📊 Reactive Financial Monitor:** Metrik finansial utama (*Total Sales, Total Expense, Net Profit,* dan *Low Stock Alerts*) dikalkulasikan secara dinamis menggunakan *computed state* di sisi klien.
* **⚠️ Soft-Alert System (< 5 Pcs):** Indikator visual pintar yang otomatis menyala (*Muted Rose Badge*) ketika kuantitas stok produk menyentuh angka di bawah 5 unit.
* **💬 WA-Saku (Restock Assistant):** Integrasi tautan URL WhatsApp lokal yang otomatis menyusun draf teks pemesanan barang dalam Bahasa Indonesia yang formal untuk dikirim ke supplier.
* **📖 Buku Kasbon Digital (Debt Tracker):** Subsistem pencatatan utang pelanggan terintegrasi untuk melacak piutang luar guna menjaga likuiditas arus kas warung tetap sehat.
* **📥 Ekspor Laporan Lokal (CSV):** Fitur ekspor data stok dan performa keuangan ke dalam format `.csv` (ramah Microsoft Excel) sebagai dokumen pendukung prasyarat pengajuan Kredit Usaha Rakyat (KUR).

---

## 🛠️ Tech Stack & Arsitektur Sistem

Aplikasi ini 100% berjalan di sisi klien (*client-side execution*) dengan memanfaatkan ekosistem web modern:

* **Core Framework:** React 18 (Vite Bundler) untuk performa rendering komponen yang instan.
* **Styling Engine:** Tailwind CSS dengan kustomisasi *fine borders* (`border-slate-100`) dan *print-media directives*.
* **State Management:** React Hooks (`useState`, `useEffect`, `useMemo`) yang modular, terstruktur, dan *AI-friendly*.
* **Data Persistence:** Web Storage API (LocalStorage) untuk penyimpanan data lokal yang permanen tanpa database server luar.
* **Iconography:** Lucide React Icons / FontAwesome CDN (gaya minimalis bergaris tipis).

---

## 📂 Struktur Direktori Proyek

```text
stoksaku/
├── public/
├── src/
│   ├── components/
│   │   ├── DashboardOverview.jsx  # Kartu metrik & ringkasan grafik SVG lokal
│   │   ├── SmartCashier.jsx       # Antarmuka POS & logika keranjang belanja
│   │   ├── StockManagement.jsx    # Tabel CRUD data produk & peringatan WA-Saku
│   │   ├── BukuKasbon.jsx         # Pelacak utang pelanggan & status kelunasan
│   │   └── ReceiptTemplate.jsx    # Format struk belanja print-ready (window.print)
│   ├── hooks/
│   │   └── useLocalStorage.js     # Custom hooks untuk manajemen state persisten
│   ├── App.jsx                    # Root component, navigasi tab, & global state
│   ├── index.css                  # Tailwind directives & print CSS rules
│   └── main.jsx
├── package.json
├── tailwind.config.js
└── README.md

```

---

## ⚡ Panduan Menjalankan Aplikasi Secara Lokal (Setup Cepat)

Pastikan perangkat Anda telah terpasang **Node.js (v16+)** dan paket manajer **NPM**.

### 1. Kloning Repositori

```bash
git clone [https://github.com/stoksaku-repo/stoksaku.git](https://github.com/stoksaku-repo/stoksaku.git)
cd stoksaku

```

### 2. Instalasi Dependensi

```bash
npm install

```

### 3. Jalankan Server Pengembangan Lokal

```bash
npm run dev

```

Buka peramban (*browser*) Anda dan masuk ke alamat yang tertera di terminal (biasanya `http://localhost:5173`).

### 4. Build Kompilasi Produksi

```bash
npm run build

```

---

## 📋 Skenario Pengujian Juri (Evaluasi 1 Menit)

Guna mempermudah proses penilaian *Indirect Judging*, berikut adalah skenario 60 detik untuk menguji fungsionalitas reaktif aplikasi:

1. **Buka Dashboard Utama:** Perhatikan data awal (*dummy data*) yang dimuat secara otomatis. Kartu **Low Stock Alerts** akan mendeteksi produk yang memiliki stok kurang dari 5 pcs.
2. **Uji Transaksi Memotong Stok:**
* Beralih ke tab **Smart Cashier**.
* Pilih salah satu produk, masukkan ke keranjang, lalu klik **Process Transaction**.
* *Verifikasi:* Buka tab **Stock Management**; kuantitas produk tersebut akan berkurang secara instan. Metrik *Total Sales* dan *Net Profit* di Dashboard juga akan bertambah secara reaktif.


3. **Uji Fitur WA-Saku:** Pada baris produk yang memiliki stok tipis, klik tombol **Restock via WhatsApp**. Sistem akan membuka tab baru yang mengarah ke API WhatsApp dengan draf pesan pesanan yang sudah terformat rapi sesuai nama produk.
4. **Uji Ekspor CSV:** Di halaman utama, klik tombol **Ekspor Laporan (CSV)**. Browser akan langsung mengunduh berkas `.csv` berisi ringkasan keuangan dan inventaris secara instan.

---

## 💾 Implementasi Logika Kunci (Core Code Snippet)

Potongan kode berikut menunjukkan bagaimana *global state management* di dalam `App.jsx` memproses transaksi penjualan, memperbarui keuangan, memotong stok barang, dan mencatat riwayat secara atomik tanpa ketergantungan database eksternal:

```javascript
// Mengurangi stok dan memperbarui metrik finansial secara reaktif dalam satu waktu
const handleCheckout = (cartItems) => {
  // 1. Validasi ketersediaan stok produk sebelum memproses transaksi
  const isStockAvailable = cartItems.every(item => {
    const originalProduct = products.find(p => p.id === item.id);
    return originalProduct && originalProduct.stock >= item.quantity;
  });

  if (!isStockAvailable) {
    alert("Transaksi gagal: Stok produk tidak mencukupi!");
    return;
  }

  // 2. Kurangi kuantitas stok produk pada state utama secara dinamis
  setProducts(prevProducts => 
    prevProducts.map(product => {
      const purchasedItem = cartItems.find(item => item.id === product.id);
      return purchasedItem ? { ...product, stock: product.stock - purchasedItem.quantity } : product;
    })
  );

  // 3. Kalkulasi pendapatan dan modal untuk memperbarui metrik finansial dashboard
  const transactionIncome = cartItems.reduce((acc, item) => acc + (item.sellPrice * item.quantity), 0);
  const transactionExpense = cartItems.reduce((acc, item) => acc + (item.buyPrice * item.quantity), 0);
  
  setTotalSales(prev => prev + transactionIncome);
  setTotalExpense(prev => prev + transactionExpense);
  
  // 4. Catat ke dalam log riwayat transaksi lokal
  setSalesHistory(prev => [
    {
      id: `TRX-${Date.now()}`,
      items: cartItems,
      total: transactionIncome,
      date: new Date().toLocaleDateString('id-ID')
    },
    ...prev
  ]);

  clearCart();
};

```

---

## 👥 Profil Pengembang

* **Nama:** Rizky Ramadhan Putra Darmadi
* **Asal Institusi:** Universitas Pamulang
* **Peran Teknis:** Solo Developer (Full-Stack Frontend Developer, UI/UX Designer, & Product Manager).

---

Terima Kasih.
