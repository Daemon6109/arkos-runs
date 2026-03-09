import * as fs from 'fs';
import * as path from 'path';

export interface FileEntry {
  name: string;
  path: string;
  size: number;
  birthTime: Date;
  modifiedTime: Date;
}

/**
 * Scans a directory and returns a list of file entries.
 * @param directoryPath - The path to the directory to scan.
 * @returns An array of FileEntry objects.
 * @throws Will throw an error if the directory does not exist or cannot be read.
 */
export function scanDirectory(directoryPath: string): FileEntry[] {
  if (!fs.existsSync(directoryPath)) {
    throw new Error(`Directory does not exist: ${directoryPath}`);
  }

  if (!fs.statSync(directoryPath).isDirectory()) {
    throw new Error(`Path is not a directory: ${directoryPath}`);
  }

  try {
    const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
    return entries.map(entry => {
      const fullPath = path.join(directoryPath, entry.name);
      const stats = fs.statSync(fullPath);
      return {
        name: entry.name,
        path: fullPath,
        size: stats.size,
        birthTime: stats.birthtime,
        modifiedTime: stats.mtime,
      };
    });
  } catch (error) {
    throw new Error(`Error reading directory: ${directoryPath}, ${error.message}`);
  }
}