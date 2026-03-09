import * as Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-xml';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';

/**
 * Highlights code blocks using Prism.js.
 * @param code - The code to highlight.
 * @param language - The programming language of the code.
 * @returns The highlighted HTML string.
 */
export function highlightCode(code: string, language: string): string {
  const grammar = Prism.languages[language.toLowerCase()];
  if (!grammar) {
    console.warn(`Unsupported language: ${language}. Returning plain text.`);
    return code;
  }
  return Prism.highlight(code, grammar, language.toLowerCase());
}