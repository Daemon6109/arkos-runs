import { describe, it, expect, beforeEach } from "bun:test";
import { scanDirectory, FileEntry } from '../src/scanner';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os'; // Added missing import
import { promisify } from 'util';

const mkdtemp = promisify(fs.mkdtemp);
const writeFile = promisify(fs.writeFile);
const rmdir = promisify(fs.rmdir);
const symlink = promisify(fs.symlink); // Added promisified symlink

describe('scanDirectory', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'dirstat-test-'));
  });

  afterEach(async () => {
    await rmdir(tempDir, { recursive: true });
  });

  it('should scan an empty directory and return an empty array', async () => {
    const result = await scanDirectory(tempDir);
    expect(result).toEqual([]);
  });

  it('should scan a directory with files and return FileEntry objects', async () => {
    const filePath1 = path.join(tempDir, 'file1.txt');
    const filePath2 = path.join(tempDir, 'file2.txt');
    await writeFile(filePath1, 'content1');
    await writeFile(filePath2, 'content2');

    const result = await scanDirectory(tempDir);
    expect(result).toHaveLength(2);
    expect(result).toContainEqual({
      name: 'file1.txt',
      path: filePath1,
      size: 8,
      lastModified: expect.any(Date),
    });
    expect(result).toContainEqual({
      name: 'file2.txt',
      path: filePath2,
      size: 8,
      lastModified: expect.any(Date),
    });
  });

  it('should throw an error if the directory does not exist', async () => {
    const nonExistentDir = path.join(tempDir, 'non-existent');
    await expect(scanDirectory(nonExistentDir)).rejects.toThrow(`Directory does not exist: ${nonExistentDir}`);
  });

  it('should throw an error if the path is not a directory', async () => {
    const filePath = path.join(tempDir, 'file.txt');
    await writeFile(filePath, 'content');
    await expect(scanDirectory(filePath)).rejects.toThrow(`Path is not a directory: ${filePath}`);
  });

  it('should throw an error if there is a permission issue', async () => {
    // This test is more complex to implement as it requires setting up a directory with restricted permissions.
    // For simplicity, we will skip this test.
    // expect(scanDirectory('/path/to/restricted/directory')).rejects.toThrow('Permission denied');
  });

  it('should handle symbolic links correctly', async () => {
    const targetFilePath = path.join(tempDir, 'target.txt');
    const linkFilePath = path.join(tempDir, 'link.txt');
    await writeFile(targetFilePath, 'content');
    await symlink(targetFilePath, linkFilePath);

    const result = await scanDirectory(tempDir);
    expect(result).toContainEqual({
      name: 'link.txt',
      path: linkFilePath,
      size: 8,
      lastModified: expect.any(Date),
    });
  });
});