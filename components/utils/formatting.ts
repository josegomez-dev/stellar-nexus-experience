/**
 * Format a wallet address by truncating it
 * @param address - The wallet address to format
 * @param startLength - Number of characters to show at the start
 * @param endLength - Number of characters to show at the end
 * @returns Formatted address string
 */
export function formatWalletAddress(
  address: string,
  startLength: number = 6,
  endLength: number = 4
): string {
  if (!address || address.length < startLength + endLength) {
    return address;
  }

  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * Format a number with proper decimal places
 * @param amount - The amount to format
 * @param decimals - Number of decimal places
 * @returns Formatted amount string
 */
export function formatAmount(amount: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Format a date to a readable string
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Generate initials from a name or wallet address
 * @param input - Name or wallet address
 * @param maxWords - Maximum number of words to use
 * @returns Uppercase initials
 */
export function generateInitials(input: string, maxWords: number = 2): string {
  if (!input) return '';

  // If it looks like a wallet address, use last 8 characters
  if (input.startsWith('G') && input.length > 50) {
    const last8 = input.slice(-8);
    return last8.slice(0, 2).toUpperCase();
  }

  // Split by spaces and take first letters
  const words = input.trim().split(/\s+/).slice(0, maxWords);
  return words.map(word => word.charAt(0).toUpperCase()).join('');
}

/**
 * Format a file size in bytes to human readable format
 * @param bytes - Size in bytes
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format a duration in milliseconds to human readable format
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}


