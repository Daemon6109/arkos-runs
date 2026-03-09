// src/formatter.ts

/**
 * Formats a file size in bytes to a human-readable string.
 * @param size - The size in bytes to format.
 * @returns A string representing the size in a human-readable format (e.g., "1.2 KB", "3.5 MB").
 */
export function formatSize(size: number): string {
  if (size < 0) {
    throw new Error('Size cannot be negative');
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return size.toFixed(1) + ' ' + units[unitIndex];
}

/**
 * Formats a date to a human-readable string.
 * @param date - The date to format.
 * @returns A string representing the date in a human-readable format (e.g., "2023-10-05", "14:30:00").
 */
export function formatDate(date: Date): string {
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}