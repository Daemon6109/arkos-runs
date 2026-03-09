import { describe, it, expect } from "bun:test";
import { createBot, a } from "../src/index";
import { registerCommands } from "../src/rest";

describe("Core Bot Functionality", () => {
  it("should export createBot function", () => {
    expect(createBot).toBeInstanceOf(Function);
  });

  it("should export a variable", () => {
    expect(a).toBe("a");
  });

  it("should register commands without throwing an error", async () => {
    await expect(registerCommands()).resolves.not.toThrow();
  });
});