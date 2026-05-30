// ============================================
// StokSaku — WhatsApp Restock Link Generator
// Generates wa.me deep links with pre-filled messages
// ============================================

/**
 * Default supplier phone number (demo).
 * Format: country code without '+' prefix.
 */
export const DEFAULT_SUPPLIER_PHONE = '6281234567890';

/**
 * Generates a WhatsApp deep link with a professional restock request message.
 *
 * @param productName - Name of the product to restock
 * @param currentStock - Current remaining stock quantity
 * @param supplierPhone - Supplier's phone number (with country code, no '+')
 * @returns Full https://wa.me/ URL ready for window.open()
 */
export function generateWhatsAppLink(
  productName: string,
  currentStock: number,
  supplierPhone: string = DEFAULT_SUPPLIER_PHONE
): string {
  const message = [
    `Halo Supplier,`,
    ``,
    `Saya ingin memesan ulang stok untuk produk berikut:`,
    `📦 *${productName}*`,
    `📉 Sisa stok saat ini: *${currentStock} pcs*`,
    ``,
    `Mohon informasi ketersediaan dan harga terbaru.`,
    `Terima kasih! 🙏`,
    ``,
    `— Dikirim via StokSaku`,
  ].join('\n');

  return `https://wa.me/${supplierPhone}?text=${encodeURIComponent(message)}`;
}
