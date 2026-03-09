import { describe, it, expect } from "bun:test";
import { validateOptions } from "../src/validation";

describe("validateOptions", () => {
  it("should return an error for invalid length", () => {
    const config = {
      length: -1,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSpecialChars: true,
    };

    const { error, validOptions } = validateOptions(config);

    expect(error).toBe("Password length must be greater than 0");
    expect(validOptions).toBeUndefined();
  });

  it("should return an error for non-boolean includeUppercase", () => {
    const config = {
      length: 10,
      includeUppercase: "true",
      includeLowercase: true,
      includeNumbers: true,
      includeSpecialChars: true,
    };

    const { error, validOptions } = validateOptions(config);

    expect(error).toBe("includeUppercase must be a boolean");
    expect(validOptions).toBeUndefined();
  });

  it("should return an error for non-boolean includeLowercase", () => {
    const config = {
      length: 10,
      includeUppercase: true,
      includeLowercase: "true",
      includeNumbers: true,
      includeSpecialChars: true,
    };

    const { error, validOptions } = validateOptions(config);

    expect(error).toBe("includeLowercase must be a boolean");
    expect(validOptions).toBeUndefined();
  });

  it("should return an error for non-boolean includeNumbers", () => {
    const config = {
      length: 10,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: "true",
      includeSpecialChars: true,
    };

    const { error, validOptions } = validateOptions(config);

    expect(error).toBe("includeNumbers must be a boolean");
    expect(validOptions).toBeUndefined();
  });

  it("should return an error for non-boolean includeSpecialChars", () => {
    const config = {
      length: 10,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSpecialChars: "true",
    };

    const { error, validOptions } = validateOptions(config);

    expect(error).toBe("includeSpecialChars must be a boolean");
    expect(validOptions).toBeUndefined();
  });

  it("should return valid options for valid input", () => {
    const config = {
      length: 10,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSpecialChars: true,
    };

    const { error, validOptions } = validateOptions(config);

    expect(error).toBeUndefined();
    expect(validOptions).toEqual(config);
  });
});