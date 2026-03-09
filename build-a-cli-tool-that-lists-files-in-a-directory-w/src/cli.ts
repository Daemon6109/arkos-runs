import { scanDirectory, FileEntry } from './scanner';
import { formatSize, formatDate } from './formatter';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

interface CliOptions {
  directory: string;
  minSize?: number;
  maxSize?: number;
  modifiedAfter?: Date;
  modifiedBefore?: Date;
}

function validateOptions(options: CliOptions): void {
  if (options.minSize !== undefined && options.minSize < 0) {
    throw new Error('Minimum size must be a non-negative number.');
  }
  if (options.maxSize !== undefined && options.maxSize < 0) {
    throw new Error('Maximum size must be a non-negative number.');
  }
  if (options.minSize !== undefined && options.maxSize !== undefined && options.minSize > options.maxSize) {
    throw new Error('Minimum size cannot be greater than maximum size.');
  }
  if (options.modifiedAfter !== undefined && options.modifiedBefore !== undefined && options.modifiedAfter > options.modifiedBefore) {
    throw new Error('Modified after date cannot be later than modified before date.');
  }
}

function filterFiles(files: FileEntry[], options: CliOptions): FileEntry[] {
  return files.filter(file => {
    if (options.minSize !== undefined && file.size < options.minSize) {
      return false;
    }
    if (options.maxSize !== undefined && file.size > options.maxSize) {
      return false;
    }
    if (options.modifiedAfter !== undefined && file.modified < options.modifiedAfter) {
      return false;
    }
    if (options.modifiedBefore !== undefined && file.modified > options.modifiedBefore) {
      return false;
    }
    return true;
  });
}

async function run(): Promise<void> {
  const argv = yargs(hideBin(process.argv))
    .option('directory', {
      alias: 'd',
      describe: 'Directory to scan',
      type: 'string',
      demandOption: true,
    })
    .option('minSize', {
      alias: 'm',
      describe: 'Minimum file size in bytes',
      type: 'number',
    })
    .option('maxSize', {
      alias: 'M',
      describe: 'Maximum file size in bytes',
      type: 'number',
    })
    .option('modifiedAfter', {
      alias: 'a',
      describe: 'Modified after date (YYYY-MM-DD)',
      type: 'string',
    })
    .option('modifiedBefore', {
      alias: 'b',
      describe: 'Modified before date (YYYY-MM-DD)',
      type: 'string',
    })
    .help()
    .argv;

  const options: CliOptions = {
    directory: argv.directory,
    minSize: argv.minSize,
    maxSize: argv.maxSize,
    modifiedAfter: argv.modifiedAfter ? new Date(argv.modifiedAfter) : undefined,
    modifiedBefore: argv.modifiedBefore ? new Date(argv.modifiedBefore) : undefined,
  };

  // Validate date strings
  if (options.modifiedAfter && isNaN(options.modifiedAfter.getTime())) {
    throw new Error('Invalid date format for --modifiedAfter. Please use YYYY-MM-DD.');
  }
  if (options.modifiedBefore && isNaN(options.modifiedBefore.getTime())) {
    throw new Error('Invalid date format for --modifiedBefore. Please use YYYY-MM-DD.');
  }

  try {
    validateOptions(options);
    const files = await scanDirectory(options.directory);
    const filteredFiles = filterFiles(files, options);

    console.log(`Scanned ${files.length} files in directory ${options.directory}`);
    console.log(`Filtered ${filteredFiles.length} files based on the provided criteria:`);

    filteredFiles.forEach(file => {
      console.log(`- ${file.name} (${formatSize(file.size)}) - Last modified: ${formatDate(file.modified)}`);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

export { run };