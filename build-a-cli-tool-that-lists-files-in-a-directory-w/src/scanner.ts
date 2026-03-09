// FILE: src/scanner.ts
import * as fs from 'fs';
import * as path from 'path';

export interface FileEntry {
  name: string;
  path: string;
  size: number;
  modified: Date;
}

/**
 * Scans a directory and returns a list of FileEntry objects.
 * @param directoryPath - The path to the directory to scan.
 * @returns A promise that resolves to an array of FileEntry objects.
 * @throws Will throw an error if the directory does not exist, is not accessible, or is not a directory.
 */
export async function scanDirectory(directoryPath: string): Promise<FileEntry[]> {
  try {
    // Check if directory exists and is a directory
    if (!fs.existsSync(directoryPath)) {
      throw new Error(`Directory does not exist: ${directoryPath}`);
    }

    const stats = fs.statSync(directoryPath);
    if (!stats.isDirectory()) {
      throw new Error(`Path is not a directory: ${directoryPath}`);
    }
  } catch (error) {
    // Handle errors during initial checks (e.g., permission denied)
    const errorMessage = `Failed to check directory: ${directoryPath}. ${error.message}`;
    throw new Error(errorMessage);
  }

  const files: FileEntry[] = [];

  const readDirectory = async (dirPath: string) => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        await readDirectory(entryPath);
      } else {
        const stats = fs.statSync(entryPath);
        files.push({
          name: entry.name,
          path: entryPath,
          size: stats.size,
          modified: stats.mtime,
        });
      }
    }
  };

  await readDirectory(directoryPath);

  return files;
}