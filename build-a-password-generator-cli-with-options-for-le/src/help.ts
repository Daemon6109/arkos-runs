/**
 * src/help.ts
 * Help/info system for displaying usage instructions
 */

export function displayHelp(): void {
  console.log(`
  Usage: password-generator [options]

  Secure password generator with customizable options.

  Options:
    -l, --length <number>      Set the length of the password (default: 12)
    -u, --uppercase            Include uppercase letters in the password
    -l, --lowercase            Include lowercase letters in the password (default)
    -n, --numbers              Include numbers in the password (default)
    -s, --symbols              Include symbols in the password
    -h, --help                 Display help and usage information

  Examples:
    $ password-generator -l 16 -u -s
    Generates a 16-character password with uppercase letters and symbols.

    $ password-generator --length 8 --numbers --symbols
    Generates an 8-character password with numbers and symbols.

    $ password-generator --help
    Displays this help message.

  Note:
  At least one character type must be selected (uppercase, lowercase, numbers, symbols).
  `);
}
