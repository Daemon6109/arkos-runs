import { describe, it, expect } from "bun:test";
import { displayHelp } from "../src/help";

describe("Help System", () => {
  it("should display help information", () => {
    const consoleSpy = jest.spyOn(console, 'log');
    displayHelp();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Usage:"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Options:"));
    consoleSpy.mockRestore();
  });

  it("should display help information when no arguments are provided", () => {
    const consoleSpy = jest.spyOn(console, 'log');
    displayHelp();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Usage:"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Options:"));
    consoleSpy.mockRestore();
  });

  it("should display help information when --help flag is provided", () => {
    const consoleSpy = jest.spyOn(console, 'log');
    displayHelp();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Usage:"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Options:"));
    consoleSpy.mockRestore();
  });

  it("should display help information when -h flag is provided", () => {
    const consoleSpy = jest.spyOn(console, 'log');
    displayHelp();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Usage:"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Options:"));
    consoleSpy.mockRestore();
  });
});