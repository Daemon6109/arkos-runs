import { run } from '../src/cli';
import { scanDirectory } from '../src/scanner';
import { formatSize, formatDate } from '../src/formatter';
import * as fs from 'fs';
import * as path from 'path';
import { jest } from '@jest/globals';

describe('CLI', () => {
  const mockDirectoryPath = path.join(__dirname, 'mockDir');
  const mockFilePath1 = path.join(mockDirectoryPath, 'file1.txt');
  const mockFilePath2 = path.join(mockDirectoryPath, 'file2.txt');

  beforeEach(() => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'statSync').mockReturnValue({
      isDirectory: jest.fn().mockReturnValue(true),
      size: 1024,
      birthtime: new Date(),
      mtime: new Date(),
    });
    jest.spyOn(fs, 'readdirSync').mockReturnValue([
      { name: 'file1.txt', isFile: jest.fn().mockReturnValue(true) },
      { name: 'file2.txt', isFile: jest.fn().mockReturnValue(true) },
    ]);
    jest.spyOn(console, 'log');
    jest.spyOn(console, 'error');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should display file statistics for a valid directory', () => {
    run(mockDirectoryPath);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('file1.txt (1.0 KB) - Created:'),
      expect.stringContaining('Modified:'),
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('file2.txt (1.0 KB) - Created:'),
      expect.stringContaining('Modified:'),
    );
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should handle a non-existent directory', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    run(mockDirectoryPath);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Directory does not exist'));
    expect(console.log).not.toHaveBeenCalled();
  });

  it('should handle a non-directory path', () => {
    (fs.statSync as jest.Mock).mockReturnValue({
      isDirectory: jest.fn().mockReturnValue(false),
      size: 1024,
      birthtime: new Date(),
      mtime: new Date(),
    });
    run(mockDirectoryPath);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Path is not a directory'));
    expect(console.log).not.toHaveBeenCalled();
  });

  it('should handle an error reading the directory', () => {
    (fs.readdirSync as jest.Mock).mockImplementation(() => {
      throw new Error('Mock read error');
    });
    run(mockDirectoryPath);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error reading directory'));
    expect(console.log).not.toHaveBeenCalled();
  });

  it('should handle an error formatting size', () => {
    (formatSize as jest.Mock).mockImplementation(() => {
      throw new Error('Mock format size error');
    });
    run(mockDirectoryPath);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Mock format size error'));
    expect(console.log).not.toHaveBeenCalled();
  });

  it('should handle an error formatting date', () => {
    (formatDate as jest.Mock).mockImplementation(() => {
      throw new Error('Mock format date error');
    });
    run(mockDirectoryPath);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Mock format date error'));
    expect(console.log).not.toHaveBeenCalled();
  });
});