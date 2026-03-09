import { formatSize, formatDate } from '../src/formatter';

describe('formatSize', () => {
  it('should format size in bytes correctly', () => {
    expect(formatSize(1024)).toBe('1.0 KB');
  });

  it('should format size in kilobytes correctly', () => {
    expect(formatSize(1048576)).toBe('1.0 MB');
  });

  it('should format size in megabytes correctly', () => {
    expect(formatSize(1073741824)).toBe('1.0 GB');
  });

  it('should format size in gigabytes correctly', () => {
    expect(formatSize(1099511627776)).toBe('1.0 TB');
  });

  it('should handle zero size correctly', () => {
    expect(formatSize(0)).toBe('0.0 B');
  });

  it('should throw an error for negative size', () => {
    expect(() => formatSize(-1)).toThrow('Size cannot be negative');
  });
});

describe('formatDate', () => {
  it('should format a valid date correctly', () => {
    const date = new Date('2023-10-05T14:30:00Z');
    expect(formatDate(date)).toBe('2023-10-05 14:30:00');
  });

  it('should handle different date formats', () => {
    const date = new Date('2021-05-20T08:45:12Z');
    expect(formatDate(date)).toBe('2021-05-20 08:45:12');
  });

  it('should handle edge case dates', () => {
    const date = new Date('1970-01-01T00:00:00Z');
    expect(formatDate(date)).toBe('1970-01-01 00:00:00');
  });

  it('should throw an error for invalid date', () => {
    const invalidDate = new Date('invalid-date');
    expect(() => formatDate(invalidDate)).toThrow('Invalid date');
  });
});