// src/index.ts
import { cli } from './cli/commands';

// Entry point of the application
// Initializes and runs the CLI interface
try {
  cli();
} catch (error) {
  console.error(`Failed to start application: ${error.message}`);
  process.exit(1);
}

// src/cli/commands.ts
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
        throw new Error(`Unknown command: ${command}. Available commands: list`);
    }
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
  }
}

// Displays help information for the CLI
function showHelp(): void {
  console.log('DirView CLI');
  console.log('Usage:');
  console.log('  dirview list <directory-path>');
  console.log('Options:');
  console.log('  --help      Show this help message');
  console.log('Description:');
  console.log('  list <directory-path> - Lists contents of the specified directory');
}

// Lists contents of a specified directory
// Handles errors related to file system operations
function listDirectory(directoryPath: string): void {
  const absolutePath = path.resolve(directoryPath);

  try {
    const files = fs.readdirSync(absolutePath);
    console.log(`Contents of "${absolutePath}":`);
    files.forEach(file => console.log(file));
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Directory not found: ${directoryPath}`);
    } else if (error.code === 'EACCES') {
      console.error(`Permission denied for directory: ${directoryPath}`);
    } else {
      console.error(`Failed to read directory: ${error.message}`);
    }
  }
}

export { cli };