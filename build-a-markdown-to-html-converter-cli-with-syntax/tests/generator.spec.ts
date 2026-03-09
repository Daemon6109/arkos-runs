import { describe, it, expect } from "bun:test";
import { generateHTML } from "../src/generator";

describe("HTML Generation", () => {
  it("should generate HTML for a simple paragraph", () => {
    const markdown = "Hello, world!";
    const expectedHTML = "<p>Hello, world!</p>";
    const result = generateHTML(markdown);
    expect(result).toBe(expectedHTML);
  });

  it("should generate HTML for a paragraph with emphasis", () => {
    const markdown = "This is *italic* text.";
    const expectedHTML = "<p>This is <em>italic</em> text.</p>";
    const result = generateHTML(markdown);
    expect(result).toBe(expectedHTML);
  });

  it("should generate HTML for a paragraph with strong emphasis", () => {
    const markdown = "This is **bold** text.";
    const expectedHTML = "<p>This is <strong>bold</strong> text.</p>";
    const result = generateHTML(markdown);
    expect(result).toBe(expectedHTML);
  });

  it("should generate HTML for a paragraph with a code block", () => {
    const markdown = "Here is some `code`.";
    const expectedHTML = "<p>Here is some <code>code</code>.</p>";
    const result = generateHTML(markdown);
    expect(result).toBe(expectedHTML);
  });

  it("should generate HTML for a code block with syntax highlighting", () => {
    const markdown = "