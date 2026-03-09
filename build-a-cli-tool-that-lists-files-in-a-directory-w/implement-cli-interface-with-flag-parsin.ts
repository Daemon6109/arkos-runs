import * as fs from 'fs';
import * as path from 'path';

// Main CLI handler function
// Parses command line arguments, processes flags, and executes commands
function cli(): void {
  const args = process.argv.slice(2);
  const [command, ...restArgs] = args;

  if (!command) {
    showHelp();
    return;
  }

  try {
    // Parse flags from command line arguments
    const { flags, remainingArgs } = parseFlags(restArgs);

    // Check for help flag before processing command
    if (flags.help) {
      showHelp();
      return;
    }

    // Validate flags against known valid flags for the command
    const validFlags = getValidFlags(command);
    for (const flag in flags) {
      if (!validFlags.includes(flag)) {
        throw new Error(`Unknown flag: --${flag}`);
      }
    }

    // Validate flag values
    if (flags.sort && !['name', 'size', 'date'].includes(flags.sort)) {
      throw new Error('Invalid sort type. Use "name", "size", or "date".');
    }

    switch (command) {
      case 'list':
        if (remainingArgs.length < 1) {
          throw new Error('Directory path is required for "list" command');
        }
        const directoryPath = remainingArgs[0];
        listDirectory(directoryPath, flags);
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
  console.log('  dirview list [OPTIONS] <directory>');
  console.log('');
  console.log('Options:');
  console.log('  -h, --help        Show this help message');
  console.log('  -s, --sort=TYPE   Sort by TYPE (name, size, date)');
  console.log('  -r, --recursive   Recursively list subdirectories');
  console.log('');
  console.log('Examples:');
  console.log('  dirview list -r /path/to/directory');
  console.log('  dirview list --sort=size /path/to/directory');
}

// Parses flags from command line arguments
function parseFlags(args: string[]): { flags: Record<string, any>, remainingArgs: string[] } {
  const flags: Record<string, any> = {};
  let remainingArgs = [...args];
  let i = 0;

  const shortToLong: Record<string, string> = {
    h: 'help',
    s: 'sort',
    r: 'recursive',
  };

  while (i < remainingArgs.length) {
    const arg = remainingArgs[i];
    if (arg.startsWith('-')) {
      if (arg.startsWith('--')) {
        // Long flag: e.g., --sort=size
        const flagParts = arg.split('=');
        const flagName = flagParts[0].substring(2);
        const flagValue = flagParts.length > 1 ? flagParts[1] : true;
        flags[flagName] = flagValue;
      } else if (arg.startsWith('-')) {
        // Short flag: e.g., -r
        const flagChars = arg.substring(1).split('');
        for (const flagChar of flagChars) {
          const longName = shortToLong[flagChar];
          if (!longName) {
            throw new Error(`Unknown short flag: -${flagChar}`);
          }
          flags[longName] = true;
        }
      }
      // Remove the processed flag from remainingArgs
      remainingArgs.splice(i, 1);
    } else {
      i++;
    }
  }

  return { flags, remainingArgs };
}

// Returns valid flags for the given command
function getValidFlags(command: string): string[] {
  switch (command) {
    case 'list':
      return ['help', 'sort', 'recursive'];
    default:
      return [];
  }
}

// Simulated function to list directory contents with flags
function listDirectory(directoryPath: string, flags: Record<string, any>): void {
  try {
    // Simulated directory listing logic
    console.log(`Listing directory: ${directoryPath}`);
    console.log('Files (sorted by name):');
    console.log('----------------------');
    console.log('NAME\tSIZE\tDATE');
    console.log('----------------------');
    console.log('file1.txt\t123\t2023-01-01');
    console.log('file2.txt\t456\t2023-01-02');

    // Apply sorting if --sort flag is present
    if (flags.sort) {
      console.log(`Sorted by: ${flags.sort}`);
    }

    // Apply recursive listing if --recursive flag is present
    if (flags.recursive) {
      console.log('Recursive listing enabled');
    }
  } catch (error) {
    console.error(`Failed to list directory: ${error.message}`);
    process.exit(1);
  }
}

// Entry point for the CLI
if (require.main === module) {
  cli();
}