import { scanDirectory, FileEntry } from './scanner';
import { formatSize, formatDate } from './formatter';
import * as yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { execSync } from 'child_process';

/**
 * Checks if npm is installed.
 * @returns True if npm is installed, false otherwise.
 */
function isNpmInstalled(): boolean {
  try {
    execSync('npm -v', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Checks if all dependencies are installed.
 * @returns True if all dependencies are installed, false otherwise.
 */
function areDependenciesInstalled(): boolean {
  try {
    execSync('npm list', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Runs the CLI application.
 */
export function run(): void {
  if (!isNpmInstalled()) {
    console.error('Error: npm is not installed. Please install npm to proceed.');
    process.exit(1);
  }

  if (!areDependenciesInstalled()) {
    console.error('Error: Missing dependencies. Please run `npm install` to install them.');
    process.exit(1);
  }

  yargs(hideBin(process.argv))
    .command(
      '$0 <directory>',
      'Scan a directory and display file statistics',
      (yargs) => {
        yargs.positional('directory', {
          describe: 'The directory to scan',
          type: 'string',
        });
      },
      async (argv) => {
        try {
          const directoryPath = argv.directory as string;
          const fileEntries = scanDirectory(directoryPath);

          fileEntries.forEach((entry) => {
            console.log(
              `${entry.name} (${formatSize(entry.size)}) - ` +
                `Created: ${formatDate(entry.birthTime)}, ` +
                `Modified: ${formatDate(entry.modifiedTime)}`
            );
          });
        } catch (error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
      }
    )
    .help()
    .argv;
}