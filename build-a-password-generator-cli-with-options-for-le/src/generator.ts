import { randomBytes } from "crypto";

/**
 * Password generation options
 */
export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSpecialChars: boolean;
}

/**
 * Generates a secure password based on the provided options
 * @param options - Password generation options
 * @returns A generated password string
 */
export function generatePassword(options: PasswordOptions): string {
  const { length, includeUppercase, includeLowercase, includeNumbers, includeSpecialChars } =
    options;

  if (length <= 0) {
    throw new Error("Password length must be greater than 0");
  }

  const characterSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    specialChars: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
  };

  let validChars = "";
  if (includeUppercase) validChars += characterSets.uppercase;
  if (includeLowercase) validChars += characterSets.lowercase;
  if (includeNumbers) validChars += characterSets.numbers;
  if (includeSpecialChars) validChars += characterSets.specialChars;

  if (validChars.length === 0) {
    throw new Error("At least one character type must be selected");
  }

  const passwordArray: string[] = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor((randomBytes(1).readUInt8() / 256) * validChars.length);
    passwordArray.push(validChars[randomIndex]);
  }

  return passwordArray.join("");
}
