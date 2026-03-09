import * as dotenv from 'dotenv';

/**
 * Loads environment variables from a .env file.
 * @returns An object containing the environment variables.
 */
export function loadConfig(): Record<string, string> {
  dotenv.config();
  return process.env;
}