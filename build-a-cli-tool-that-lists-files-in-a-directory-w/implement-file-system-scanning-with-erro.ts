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
  console.log('  list <directory-path>  List contents of a directory');
}

// Scans a directory and lists its contents
// Handles errors for invalid paths, permission issues, and non-directory paths
function listDirectory(directoryPath: string): void {
  try {
    // Check if the path exists and is a directory
    const stats = fs.statSync(directoryPath);
    if (!stats.isDirectory()) {
      throw new Error(`Path "${directoryPath}" is not a directory.`);
    }

    // Read the contents of the directory
    const files = fs.readdirSync(directoryPath, { withFileTypes: true });

    // Process the files and output the result
    console.log(`Contents of "${directoryPath}":`);
    for (const file of files) {
      console.log(`${file.name} ${file.isDirectory() ? ' (directory)' : ' (file)'}`);
    }
  } catch (error) {
    // Handle errors here
    console.error(`Error reading directory "${directoryPath}": ${error.message}`);
    throw error; // Rethrow to be caught by the cli function's error handling
  }
}

// Entry point of the application
// Initializes and runs the CLI interface
try {
  cli();
} catch (error) {
  console.error(`Failed to start application: ${error.message}`);
  process.exit(1);
}