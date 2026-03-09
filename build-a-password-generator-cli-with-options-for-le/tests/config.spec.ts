import { describe, it, expect } from "bun:test";
import { parseConfig } from "../src/config";

describe("parseConfig", () => {
  it("should parse basic options correctly", () => {
    const argv = ["--length", "12", "--includeUppercase", "--includeLowercase", "--includeNumbers", "--includeSpecialChars"];
    const config = parseConfig(argv);
    expect(config).toEqual({
      length: 12,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSpecialChars: true,
      help: false,
    });
  });

  it("should handle missing options and default to false", () => {
    const argv = ["--length", "12"];
    const config = parseConfig(argv);
    expect(config).toEqual({
      length: 12,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: false,
      includeSpecialChars: false,
      help: false,
    });
  });

  it("should parse help option correctly", () => {
    const argv = ["--help"];
    const config = parseConfig(argv);
    expect(config).toEqual({
      length: 0,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: false,
      includeSpecialChars: false,
      help: true,
    });
  });

  it("should handle invalid length input", () => {
    const argv = ["--length", "-5"];
    const config = parseConfig(argv);
    expect(config).toEqual({
      length: -5,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: false,
      includeSpecialChars: false,
      help: false,
    });
  });

  it("should handle non-numeric length input", () => {
    const argv = ["--length", "abc"];
    const config = parseConfig(argv);
    expect(config).toEqual({
      length: NaN,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: false,
      includeSpecialChars: false,
      help: false,
    });
  });

  it("should ignore unknown options", () => {
    const argv = ["--length", "12", "--unknownOption"];
    const config = parseConfig(argv);
    expect(config).toEqual({
      length: 12,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: false,
      includeSpecialChars: false,
      help: false,
    });
  });
});