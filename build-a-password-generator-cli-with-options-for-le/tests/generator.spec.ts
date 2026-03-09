import { describe, it, expect } from "bun:test";
import { generatePassword } from "../src/generator";

describe("Password Generator", () => {
  it("should generate a password of the specified length", () => {
    const options = {
      length: 10,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: true,
      includeSpecialChars: false,
    };
    const password = generatePassword(options);
    expect(password.length).toBe(10);
  });

  it("should include uppercase letters when specified", () => {
    const options = {
      length: 10,
      includeUppercase: true,
      includeLowercase: false,
      includeNumbers: false,
      includeSpecialChars: false,
    };
    const password = generatePassword(options);
    expect(/[A-Z]/.test(password)).toBe(true);
  });

  it("should include lowercase letters when specified", () => {
    const options = {
      length: 10,
      includeUppercase: false,
      includeLowercase: true,
      includeNumbers: false,
      includeSpecialChars: false,
    };
    const password = generatePassword(options);
    expect(/[a-z]/.test(password)).toBe(true);
  });

  it("should include numbers when specified", () => {
    const options = {
      length: 10,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: true,
      includeSpecialChars: false,
    };
    const password = generatePassword(options);
    expect(/[0-9]/.test(password)).toBe(true);
  });

  it("should include special characters when specified", () => {
    const options = {
      length: 10,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: false,
      includeSpecialChars: true,
    };
    const password = generatePassword(options);
    expect(/[!@#$%^&*(),.?":{}|<>]/.test(password)).toBe(true);
  });

  it("should throw an error if length is less than or equal to 0", () => {
    const options = {
      length: 0,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSpecialChars: true,
    };
    expect(() => generatePassword(options)).toThrow("Password length must be greater than 0");
  });
});