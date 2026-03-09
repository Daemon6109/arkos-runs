import { parseConfig } from "./config";
import { generatePassword } from "./generator";
import { displayHelp } from "./help";
import { validateOptions } from "./validation";

export async function run(argv: string[]): Promise<void> {
  try {
    const config = parseConfig(argv);

    if (config.help) {
      displayHelp();
      return;
    }

    const { error, validOptions } = validateOptions(config);

    if (error) {
      console.error(`Error: ${error}`);
      displayHelp();
      return;
    }

    const password = generatePassword(validOptions);
    console.log(`Generated Password: ${password}`);
  } catch (error) {
    console.error(`An unexpected error occurred: ${error.message}`);
    displayHelp();
  }
}
