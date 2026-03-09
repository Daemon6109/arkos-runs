import { scanDirectory, FileEntry } from '../src/scanner';
import * as fs from 'fs';
import * as path from 'path';
import { jest } from '@jest/globals';

describe('scanDirectory', () => {
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
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should scan a directory and return a list of file entries', () => {
    const result = scanDirectory(mockDirectoryPath);
    expect(result).toEqual([
      {
        name: 'file1.txt',
        path: mockFilePath1,
        size: 1024,
        birthTime: expect.any(Date),
        modifiedTime: expect.any(Date),
      },
      {
        name: 'file2.txt',
        path: mockFilePath2,
        size: 1024,
        birthTime: expect.any(Date),
        modifiedTime: expect.any(Date),
      },
    ]);
  });

  it('should throw an error if the directory does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    expect(() => scanDirectory(mockDirectoryPath)).toThrow(`Directory does not exist: ${mockDirectoryPath}`);
  });

  it('should throw an error if the path is not a directory', () => {
    (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: jest.fn().mockReturnValue(false) });
    expect(() => scanDirectory(mockDirectoryPath)).toThrow(`Path is not a directory: ${mockDirectoryPath}`);
  });

  it('should throw an error if reading the directory fails', () => {
    (fs.readdirSync as jest.Mock).mockImplementation(() => {
      throw new Error('Mock read error');
    });
    expect(() => scanDirectory(mockDirectoryPath)).toThrow('Mock read error');
  });

  it('should handle empty directories', () => {
    (fs.readdirSync as jest.Mock).mockReturnValue([]);
    const result = scanDirectory(mockDirectoryPath);
    expect(result).toEqual([]);
  });
});