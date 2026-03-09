// src/validation.ts

export interface PasswordOptions {
  length: number;
  includeLowercase: boolean;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSpecialChars: boolean;
}

export function validateOptions(options: PasswordOptions): void {
  if (typeof options.length !== "number" || options.length <= 0) {
    throw new Error("Password length must be a positive number.");
  }

  if (typeof options.includeLowercase !== "boolean") {
    throw new Error("includeLowercase must be a boolean.");
  }

  if (typeof options.includeUppercase !== "boolean") {
    throw new Error("includeUppercase must be a boolean.");
  }

  if (typeof options.includeNumbers !== "boolean") {
    throw new Error("includeNumbers must be a boolean.");
  }

  if (typeof options.includeSpecialChars !== "boolean") {
    throw new Error("includeSpecialChars must be a boolean.");
  }

  if (
    !options.includeLowercase &&
    !options.includeUppercase &&
    !options.includeNumbers &&
    !options.includeSpecialChars
  ) {
    throw new Error("At least one character type must be selected.");
  }
}
