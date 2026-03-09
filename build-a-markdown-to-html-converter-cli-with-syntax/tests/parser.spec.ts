import { describe, it, expect } from "bun:test";
import { parseMarkdown } from "../src/parser";

describe("Markdown Parser", () => {
  it("should parse a simple markdown text", () => {
    const markdown = "# Hello World\n\nThis is a simple markdown text.";
    const ast = parseMarkdown(markdown);

    expect(ast).toEqual({
      type: "root",
      children: [
        {
          type: "heading",
          depth: 1,
          children: [
            {
              type: "text",
              value: "Hello World"
            }
          ]
        },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              value: "This is a simple markdown text."
            }
          ]
        }
      ]
    });
  });

  it("should parse bold and italic text", () => {
    const markdown = "**Bold Text** and *Italic Text*";
    const ast = parseMarkdown(markdown);

    expect(ast).toEqual({
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [
            {
              type: "strong",
              children: [
                {
                  type: "text",
                  value: "Bold Text"
                }
              ]
            },
            {
              type: "text",
              value: " and "
            },
            {
              type: "emphasis",
              children: [
                {
                  type: "text",
                  value: "Italic Text"
                }
              ]
            }
          ]
        }
      ]
    });
  });

  it("should parse a code block", () => {
    const markdown = "