import * as fs from 'fs';
import * as path from 'path';

// Main CLI handler function
// Parses command line arguments and executes corresponding commands
function cli(): void {
  const args = process.argv.slice(2);
  const [command, ...restArgs] = args;

  if (!command) {
    showHelp();
    return;
  }

  try {
    switch (command) {
      case 'list':
        if (restArgs.length < 1) {
          throw new Error('Directory path is required for "list" command');
        }
        listDirectory(restArgs[0]);
        break;
      default:
        showHelp();
    }
  } catch (error) {
    console.error(`Failed to execute command: ${error.message}`);
    process.exit(1);
  }
}

// Displays help information for the CLI
function showHelp(): void {
  console.log('Usage:');
  console.log('  dirview list <directory-path>');
  console.log('');
  console.log('Commands:');
  console.log('  list <directory-path>  List files and directories in the specified path');
}

// Formats a date into a human-readable string
// Example: "2 days ago", "3 hours ago", "Jan 1, 2023"
function formatDate(date: Date): string {
  try {
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    const diff = Date.now() - date.getTime();
    const thresholds = [
      { value: 31536000000, unit: 'year' },
      { value: 2592000000, unit: 'month' },
      { value: 604800000, unit: 'week' },
      { value: 86400000, unit: 'day' },
      { value: 3600000, unit: 'hour' },
      { value: 60000, unit: 'minute' },
      { value: 1000, unit: 'second' },
    ];

    for (const { value, unit } of thresholds) {
      const count = Math.floor(diff / value);
      if (count >= 1) {
        return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
      }
    }

    return date.toLocaleDateString();
  } catch (error) {
    console.error(`Error formatting date: ${error.message}`);
    return 'Invalid date';
  }
}

// Converts bytes to a human-readable string
// Example: "1.2 MB", "5 KB", "1024 B"
function formatSize(bytes: number): string {
  try {
    if (bytes < 0) {
      throw new Error('Bytes cannot be negative');
    }
    if (bytes === 0) {
      return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, unitIndex);
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  } catch (error) {
    console.error(`Error formatting size: ${error.message}`);
    return '0 B';
  }
}

// Lists the contents of a directory with file details
// Shows name, size, type, and last modified date for each item
function listDirectory(directoryPath: string): void {
  try {
    // Resolve the absolute path
    const absolutePath = path.resolve(directoryPath);

    // Check if the path exists and is a directory
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Directory not found: ${directoryPath}`);
    }

    if (!fs.lstatSync(absolutePath).isDirectory()) {
      throw new Error(`Path is not a directory: ${directoryPath}`);
    }

    // Read directory contents
    const entries = fs.readdirSync(absolutePath, { withFileTypes: true });

    // Process each entry
    console.log(`Listing contents of "${directoryPath}":`);
    console.log('Name       | Size     | Type     | Modified Date');
    console.log('----------|----------|----------|------------------');
    for (const entry of entries) {
      const fullPath = path.join(absolutePath, entry.name);
      const stats = fs.lstatSync(fullPath);

      const name = entry.name;
      const size = formatSize(stats.size);
      const type = entry.isDirectory() ? 'Directory' : 'File';
      const modifiedDate = formatDate(stats.mtime);

      console.log(`${name.padEnd(10)} | ${size.padEnd(8)} | ${type.padEnd(8)} | ${modifiedDate}`);
    }
  } catch (error) {
    console.error(`Failed to list directory: ${error.message}`);
    process.exit(1);
  }
}

export { cli, formatDate, formatSize, listDirectory };