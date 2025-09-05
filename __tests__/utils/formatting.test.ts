import {
  formatWalletAddress,
  formatAmount,
  formatDate,
  generateInitials,
  formatFileSize,
  formatDuration,
} from '@/components/utils/formatting';

describe('formatting utilities', () => {
  describe('formatWalletAddress', () => {
    it('should format a valid wallet address', () => {
      const address = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const formatted = formatWalletAddress(address);
      expect(formatted).toBe('GABCDE...WXYZ');
    });

    it('should return original address if too short', () => {
      const address = 'GABCDE';
      const formatted = formatWalletAddress(address);
      expect(formatted).toBe(address);
    });

    it('should handle empty string', () => {
      const formatted = formatWalletAddress('');
      expect(formatted).toBe('');
    });

    it('should handle null/undefined', () => {
      const formatted = formatWalletAddress(null as any);
      expect(formatted).toBe(null);
    });
  });

  describe('formatAmount', () => {
    it('should format numbers with default decimals', () => {
      expect(formatAmount(1234.5678)).toBe('1,234.57');
      expect(formatAmount(1000)).toBe('1,000');
    });

    it('should format with custom decimals', () => {
      expect(formatAmount(1234.5678, 4)).toBe('1,234.5678');
      expect(formatAmount(1000, 0)).toBe('1,000');
    });

    it('should handle zero', () => {
      expect(formatAmount(0)).toBe('0');
    });

    it('should handle negative numbers', () => {
      expect(formatAmount(-1234.56)).toBe('-1,234.56');
    });
  });

  describe('formatDate', () => {
    it('should format date with default options', () => {
      const date = new Date('2023-12-25T12:00:00Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Dec 25, 2023/);
    });

    it('should format date string', () => {
      const formatted = formatDate('2023-12-25T12:00:00Z');
      expect(formatted).toMatch(/Dec 25, 2023/);
    });

    it('should format with custom options', () => {
      const date = new Date('2023-12-25T12:00:00Z');
      const formatted = formatDate(date, { year: 'numeric', month: 'long' });
      expect(formatted).toBe('December 2023');
    });
  });

  describe('generateInitials', () => {
    it('should generate initials from name', () => {
      expect(generateInitials('John Doe')).toBe('JD');
      expect(generateInitials('Alice Bob Charlie')).toBe('AB');
    });

    it('should generate initials from wallet address', () => {
      const address = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const initials = generateInitials(address);
      expect(initials).toBe('ST');
    });

    it('should handle single word', () => {
      expect(generateInitials('John')).toBe('J');
    });

    it('should handle empty string', () => {
      expect(generateInitials('')).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('should handle zero bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
    });

    it('should handle small sizes', () => {
      expect(formatFileSize(500)).toBe('500 Bytes');
    });
  });

  describe('formatDuration', () => {
    it('should format milliseconds to seconds', () => {
      expect(formatDuration(5000)).toBe('5s');
    });

    it('should format to minutes', () => {
      expect(formatDuration(120000)).toBe('2m 0s');
    });

    it('should format to hours', () => {
      expect(formatDuration(7200000)).toBe('2h 0m');
    });

    it('should format to days', () => {
      expect(formatDuration(172800000)).toBe('2d 0h');
    });

    it('should handle zero', () => {
      expect(formatDuration(0)).toBe('0s');
    });
  });
});
