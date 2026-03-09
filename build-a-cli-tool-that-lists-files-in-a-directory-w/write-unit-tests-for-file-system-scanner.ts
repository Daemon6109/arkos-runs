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
  expect(consoleLogSpy).toHaveBeenCalledWith('Usage:');
  expect(consoleLogSpy).toHaveBeenCalledWith('  list <directory>  List files in the specified directory');
});

// Test: CLI with unknown command should show help
it('should show help for unknown command', () => {
  process.argv = ['node', 'script.js', 'unknown'];
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cli();
  expect(consoleLogSpy).toHaveBeenCalledWith('Usage:');
  expect(consoleLogSpy).toHaveBeenCalledWith('  list <directory>  List files in the specified directory');
});

// Test: CLI 'list' with no arguments should error
it('should error when "list" has no arguments', () => {
  process.argv = ['node', 'script.js', 'list'];
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  cli();
  expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to execute command: Directory path is required for "list" command');
});

// Test: CLI 'list' with valid directory should list files
it('should list files when "list" is called with valid directory', () => {
  process.argv = ['node', 'script.js', 'list', '/valid/path'];
  fs.existsSync.mockReturnValue(true);
  fs.stat.mockImplementation((filePath) => {
    if (filePath === '/valid/path') {
      return { isDirectory: () => true };
    }
    return null;
  });
  fs.readdir.mockImplementation((filePath) => {
    if (filePath === '/valid/path') {
      return ['file1.txt', 'file2.txt'];
    }
    return [];
  });
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cli();
  expect(consoleLogSpy).toHaveBeenCalledWith('Files in /valid/path:');
  expect(consoleLogSpy).toHaveBeenCalledWith('file1.txt');
  expect(consoleLogSpy).toHaveBeenCalledWith('file2.txt');
});

// Test: CLI 'list' with invalid path should error
it('should error when "list" is called with invalid path', () => {
  process.argv = ['node', 'script.js', 'list', '/invalid/path'];
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  cli();
  expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to execute command: Directory path is required for "list" command');
});

// Test: CLI 'list' with permission denied error
it('should error when "list" is called with permission denied', () => {
  process.argv = ['node', 'script.js', 'list', '/no-permission'];
  fs.existsSync.mockReturnValue(true);
  fs.stat.mockImplementation(() => {
    throw new Error('Permission denied');
  });
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  cli();
  expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to execute command: Permission denied');
});

// Test: CLI 'list' with non-directory path should error
it('should error when "list" is called with non-directory path', () => {
  process.argv = ['node', 'script.js', 'list', '/non-directory'];
  fs.existsSync.mockReturnValue(true);
  fs.stat.mockImplementation(() => {
    return { isDirectory: () => false };
  });
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  cli();
  expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to execute command: Invalid directory path');
});

// Test: CLI 'list' with empty directory should list nothing
it('should list empty directory when "list" is called with empty directory', () => {
  process.argv = ['node', 'script.js', 'list', '/empty-dir'];
  fs.existsSync.mockReturnValue(true);
  fs.stat.mockImplementation(() => {
    return { isDirectory: () => true };
  });
  fs.readdir.mockImplementation(() => []);
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cli();
  expect(consoleLogSpy).toHaveBeenCalledWith('Files in /empty-dir:');
});