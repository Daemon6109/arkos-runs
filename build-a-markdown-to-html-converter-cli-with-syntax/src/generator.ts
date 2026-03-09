import { Node } from './parser';
import { highlightCode } from './highlighter';

/**
 * Generates HTML from a Markdown AST.
 * @param ast - The Abstract Syntax Tree (AST) of the Markdown content.
 * @returns The generated HTML string.
 */
export function generateHTML(ast: Node[]): string {
  let html = '';

  for (const node of ast) {
    switch (node.type) {
      case 'paragraph':
        html += `<p>${generateHTML(node.children)}</p>`;
        break;
      case 'heading':
        html += `<h${node.level}>${generateHTML(node.children)}</h${node.level}>`;
        break;
      case 'text':
        html += node.value;
        break;
      case 'code':
        html += `<pre><code class="language-${node.lang}">${highlightCode(node.code, node.lang)}</code></pre>`;
        break;
      case 'link':
        html += `<a href="${node.url}">${generateHTML(node.children)}</a>`;
        break;
      case 'list':
        html += node.ordered ? '<ol>' : '<ul>';
        for (const item of node.items) {
          html += `<li>${generateHTML(item.children)}</li>`;
        }
        html += node.ordered ? '</ol>' : '</ul>';
        break;
      default:
        console.warn(`Unsupported node type: ${node.type}`);
    }
  }

  return html;
}