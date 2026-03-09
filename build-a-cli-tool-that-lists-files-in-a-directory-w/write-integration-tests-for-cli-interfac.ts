import { cli } from './cli/commands';
import * as fs from 'fs';
import * as path from 'path';
import { describe, it, beforeEach, afterEach, expect, jest } from '@jest/globals';

// Mock fs functions
const originalStat = fs.stat;
const originalExistsSync = fs.existsSync;
const originalReaddir = fs.readdir;

beforeEach(() => {
  jest.spyOn(fs, 'existsSync').mockImplementation(originalExistsSync);
  jest.spyOn(fs, 'stat').mockImplementation(originalStat);
  jest.spyOn(fs, 'readdir').mockImplementation(originalReaddir);
});

afterEach(() => {
  jest.restoreAllMocks();
});

// Test: CLI with no command should show help
it('should show help when no command is provided', () => {
  process.argv = ['node', 'script.js'];
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cli();
  expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
  consoleLogSpy.mockRestore();
});

// Test: CLI with valid command and no flags
it('should list files in the current directory', () => {
  // Mock fs.readdir to return some files
  const mockFiles = ['file1.txt', 'file2.txt'];
  jest.spyOn(fs, 'readdir').mockImplementation((dir, cb) => {
    cb(null, mockFiles);
  });

  process.argv = ['node', 'script.js', 'ls'];
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cli();
  // Check that the output is a table with the files
  expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('| file1.txt |'));
  expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('| file2.txt |'));
  consoleLogSpy.mockRestore();
});

// Test: CLI with --help flag
it('should show help for the ls command', () => {
  process.argv = ['node', 'script.js', 'ls', '--help'];
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cli();
  expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Usage: ls'));
  consoleLog
});

// Test: CLI with unknown flag
it('should throw error for unknown flag', () => {
  process.argv = ['node', 'script.js', 'ls', '--invalid'];
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => cli()).toThrow('Unknown flag: --invalid');
  consoleErrorSpy.mockRestore();
});

// Test: CLI with invalid command
it('should show error for invalid command', () => {
  process.argv = ['node', 'script.js', 'invalid-command'];
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => cli()).toThrow('Unknown command: invalid-command');
  consoleErrorSpy.mockRestore();
});

// Test: CLI with --format=table
it('should output table when --format=table is used', () => {
  // Mock fs.readdir to return some files
  const mockFiles = ['file1.txt', 'file2.txt'];
  jest.spyOn(fs, 'readdir').mockImplementation((dir, cb) => {
    cb(null, mockFiles);
  });

  process.argv = ['node', 'script.js', 'ls', '--format', 'table'];
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cli();
  // Check that the output is a table with the files
  expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('| file1.txt |'));
  expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('| file2.txt |'));
  consoleLogSpy.mockRestore();
});

// Test: CLI with invalid path
it('should show error when invalid path is provided', () => {
  // Mock fs.existsSync to return false
  jest.spyOn(fs, 'existsSync').mockImplementation((path) => {
    return false;
  });

  process.argv = ['node', 'script.js', 'ls', '/invalid/path'];
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => cli()).toThrow('Invalid path: /invalid/path');
  consoleErrorSpy.mockRestore();
});

// Test: CLI with --format=table and --sort=size
it('should output sorted table by size', () => {
  // Mock fs.readdir to return files with different sizes
  const mockFiles = [
    { name: 'small.txt', size: 1024 },
    { name: 'large.txt', size: 1048576 }
  ];
  jest.spyOn(fs, 'readdir').mockImplementation((dir, cb) => {
    cb(null, mockFiles.map(f => f.name));
  });

  // Mock fs.stat to return file sizes
  jest.spyOn(fs, 'stat').mockImplementation((filePath, cb) => {
    const file = mockFiles.find(f => f.name === path.basename(filePath));
    if (file) {
      cb(null, { size: file.size });
    } else {
      cb(new Error('File not found'));
    }
  });

  process.argv = ['node', 'script.js', 'ls', '--format', 'table', '--sort', 'size'];
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cli();
  // Check that the output is a sorted table by size
  expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('| small.txt | 1 KB |'));
  expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('| large.txt | 1 MB |'));
  consoleLogSpy.mockRestore();
});