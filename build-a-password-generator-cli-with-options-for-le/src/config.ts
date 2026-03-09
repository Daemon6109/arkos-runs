import { Command } from "commander";
import { validateOptions } from "./validation";

interface Config {
  length: number;
  includeLowercase: boolean;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export function parseConfig(): Config {
  const program = new Command();

  program
    .option("-l, --length <number>", "Length of the password", "12")
    .option("-L, --no-lowercase", "Exclude lowercase letters")
    .option("-U, --no-uppercase", "Exclude uppercase letters")
    .option("-N, --no-numbers", "Exclude numbers")
    .option("-S, --no-symbols", "Exclude symbols")
    .helpOption("-h, --help", "Display help information")
    .parse(process.argv);

  const options = program.opts();

  const config: Config = {
    length: Number.parseInt(options.length, 10),
    includeLowercase: !options.noLowercase,
    includeUppercase: !options.noUppercase,
    includeNumbers: !options.noNumbers,
    includeSymbols: !options.noSymbols,
  };

  validateOptions(config);

  return config;
}
