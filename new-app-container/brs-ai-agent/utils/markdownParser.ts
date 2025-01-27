import { marked } from 'marked';
import hljs from 'highlight.js';

// Create a custom renderer
const renderer = new marked.Renderer();

renderer.code = function ({ text, lang }) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(text, { language: lang }).value;
    } catch (e) {
      console.error(e);
    }
  }
  return text; // Return original code if language not found
};

// Configure marked options
marked.setOptions({
  renderer: renderer,
  breaks: true, // Enable line breaks
  gfm: true, // Enable GitHub Flavored Markdown
});

export async function parseMarkdown(text: string): Promise<string> {
  try {
    // Sanitize code fence markers
    const cleanText = text.replace(/```(\w+)?\n/g, (match, lang) => {
      return `\`\`\`${lang || ''}\n`;
    });

    // Parse markdown to HTML
    const html = await marked(cleanText);

    // Add target="_blank" to links for security
    return html.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return text; // Return original text if parsing fails
  }
}
