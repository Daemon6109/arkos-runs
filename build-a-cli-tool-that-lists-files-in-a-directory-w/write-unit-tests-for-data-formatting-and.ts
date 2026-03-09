import { formatSize, formatDate } from './utils';

describe('formatSize', () => {
  it('should format 0 bytes as "0 B"', () => {
    expect(formatSize(0)).toBe('0 B');
  });

  it('should format 1 byte as "1 B"', () => {
    expect(formatSize(1)).toBe('1 B');
  });

  it('should format 1023 bytes as "1023 B"', () => {
    expect(formatSize(1023)).toBe('1023 B');
  });

  it('should format 1024 bytes as "1 KB"', () => {
    expect(formatSize(1024)).toBe('1 KB');
  });

  it('should format 1024*1024 bytes as "1 MB"', () => {
    expect(formatSize(1024 * 1024)).toBe('1 MB');
  });

  it('should format 1024*1024*1024 bytes as "1 GB"', () => {
    expect(formatSize(1024 * 1024 * 1024)).toBe('1 GB');
  });

  it('should format 1024^4 bytes as "1 TB"', () => {
    expect(formatSize(1024 ** 4)).toBe('1 TB');
  });

  it('should format 1500 bytes as "1.46 KB"', () => {
    expect(formatSize(1500)).toBe('1.46 KB');
  });

  it('should format large numbers with proper units', () => {
    expect(formatSize(1024 ** 5)).toBe('1 TB');
    expect(formatSize(1024 ** 6)).toBe('1 PB');
  });
});

describe('formatDate', () => {
  it('should format a valid Date object as "YYYY-MM-DD HH:MM:SS"', () => {
    const date = new Date('2023-10-05T14:48:00Z');
    expect(formatDate(date)).toBe('2023-10-05 14:48:00');
  });

  it('should handle dates in the past', () => {
    const date = new Date('2020-01-01T00:00:00Z');
    expect(formatDate(date)).toBe('2020-01-01 00:00:00');
  });

  it('should handle dates in the future', () => {
    const date = new Date('2030-12-31T23:59:59Z');
    expect(formatDate(date)).toBe('2030-12-31 23:59:59');
  });

  it('should return "Invalid date" for invalid Date objects', () => {
    const invalidDate = new Date('invalid');
    expect(formatDate(invalidDate)).toBe('Invalid date');
  });

  it('should format dates with time zone awareness', () => {
    const date = new Date('2023-10-05T12:00:00.000Z'); // UTC
    expect(formatDate(date)).toBe('2023-10-05 12:00:00');
  });

  it('should handle edge case of milliseconds', () => {
    const date = new Date('2023-10-05T12:00:00.123Z');
    expect(formatDate(date)).toBe('2023-10-05 12:00:00');
  });
});