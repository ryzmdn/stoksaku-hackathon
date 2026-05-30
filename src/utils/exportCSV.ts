// ============================================
// StokSaku — CSV Export Utility
// Pure native JS Blob-based export, zero deps
// ============================================

/**
 * Converts a 2D array of data into a CSV file and triggers download.
 * Handles special characters, commas, and newlines in cell values.
 *
 * @param data - 2D string array where data[0] is the header row
 * @param fileName - Output file name (without extension)
 */
export function exportToCSV(data: string[][], fileName: string): void {
  // Escape cell values: wrap in quotes if it contains comma, quote, or newline
  const escapeCell = (cell: string): string => {
    const str = String(cell);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Build CSV string from rows
  const csvContent = data
    .map((row) => row.map(escapeCell).join(','))
    .join('\n');

  // Add BOM for proper UTF-8 encoding in Excel (important for Rupiah symbol & Indonesian chars)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create download link and trigger click
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formats a number as Indonesian Rupiah string for CSV output.
 * Uses plain text format (no currency symbol) for spreadsheet compatibility.
 */
export function formatRupiahCSV(amount: number): string {
  return new Intl.NumberFormat('id-ID').format(amount);
}
