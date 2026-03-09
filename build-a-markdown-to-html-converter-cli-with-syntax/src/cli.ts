import { parseMarkdown } from './parser';
import { generateHTML } from './generator';
import { highlightCode } from './highlighter';
import { loadConfig, defaultConfig } from './config';
import { program } from 'commander';
import { version } from 'process';
import fs from 'fs';
import inquirer from 'inquirer';

const MIN_NODE_VERSION = '14.0.0';

function checkNodeVersion() {
  const currentNodeVersion = version;
  if (currentNodeVersion < MIN_NODE_VERSION) {
    console.error(`Node.js version ${currentNodeVersion} is not supported. Please upgrade to Node.js ${MIN_NODE_VERSION} or higher.`);
    console.error('You can download the latest version from https://nodejs.org/');
    process.exit(1);
  }
}

async function run() {
  checkNodeVersion();

  program
    .version('1.0.0')
    .option('-i, --input <file>', 'Input markdown file')
    .option('-o, --output <file>', 'Output HTML file')
    .option('-c, --config <file>', 'Configuration file', defaultConfig)
    .parse(process.argv);

  const options = program.opts();
  const inputFilePath = options.input;
  const outputFilePath = options.output;
  const configFilePath = options.config;

  if (!inputFilePath || !outputFilePath) {
    console.error('Both input and output files are required.');
    program.outputHelp();
    process.exit(1);
  }

  try {
    const config = await loadConfig(configFilePath);
    const markdownContent = await fs.promises.readFile(inputFilePath, 'utf-8');
    const ast = parseMarkdown(markdownContent);
    const highlightedAst = highlightCode(ast, config);
    const htmlContent = generateHTML(highlightedAst);

    await fs.promises.writeFile(outputFilePath, htmlContent, 'utf-8');
    console.log(`Conversion successful. HTML file generated at ${outputFilePath}`);
  } catch (error) {
    console.error('An error occurred during conversion:', error);
    process.exit(1);
  }

  // Interactive flag selection with autocomplete
  const flags = [
    { name: 'input', value: inputFilePath },
    { name: 'output', value: outputFilePath },
    { name: 'config', value: configFilePath }
  ];

  const { selectedFlag } = await inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'selectedFlag',
      message: 'Select a flag to view its value:',
      source: async (answersSoFar, input) => {
        return flags.filter(flag => flag.name.includes(input));
      }
    }
  ]);

  const selectedValue = flags.find(flag => flag.name === selectedFlag)?.value;
  console.log(`Selected flag value: ${selectedValue}`);
}

export { run };