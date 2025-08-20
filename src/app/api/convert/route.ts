import { remark } from "remark";
import html from "remark-html";
import htmlToDocx from "html-to-docx";

// Function to clean up code blocks and preserve indentation
function preprocessCodeBlocks(htmlContent: string): string {
  return htmlContent.replace(/<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g, (match, attributes, content) => {
    // Decode HTML entities
    const decodedContent = content
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    // Split into lines and remove common leading whitespace
    const lines = decodedContent.split('\n');
    
    // Remove empty first and last lines
    if (lines[0].trim() === '') lines.shift();
    if (lines[lines.length - 1].trim() === '') lines.pop();
    
    if (lines.length === 0) return match;
    
    // Find minimum indentation (excluding empty lines)
    const nonEmptyLines = lines.filter((line: string) => line.trim() !== '');
    if (nonEmptyLines.length === 0) return match;
    
    const minIndent = Math.min(...nonEmptyLines.map((line: string) => {
      const match = line.match(/^\s*/);
      return match ? match[0].length : 0;
    }));
    
    // Remove common indentation
    const cleanedLines = lines.map((line: string) => {
      if (line.trim() === '') return '';
      return line.substring(minIndent);
    });
    
    // Convert to proper line breaks for DOCX and preserve formatting
    const formattedLines = cleanedLines.map((line: string) => {
      if (line.trim() === '') return '<br/>';
      // Escape HTML entities and preserve spaces
      const escapedLine = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/ /g, '&nbsp;'); // Preserve spaces
      return `<span style="display: block; font-family: 'Consolas', 'Monaco', 'Courier New', monospace;">${escapedLine}</span>`;
    });
    
    return `<div style="background-color: #f8fafc; padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px; margin: 15px 0; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 11pt; line-height: 1.5;">${formattedLines.join('')}</div>`;
  });
}

export async function POST(req: Request) {
  const { markdown } = await req.json();
  const processedContent = await remark().use(html).process(markdown);
  let contentHtml = processedContent.toString();
  
  // Preprocess code blocks to clean up indentation
  contentHtml = preprocessCodeBlocks(contentHtml);

  // Inject custom styles in a full HTML document structure
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
          }
          h1, h2, h3, h4, h5, h6 {
            font-weight: normal;
          }
          h1 { font-size: 22pt; }
          h2 { font-size: 18pt; }
          h3 { font-size: 16pt; }
          h4 { font-size: 14pt; }
          p {
            margin-bottom: 10px;
          }
          pre {
            background-color: #f8fafc;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            white-space: pre-wrap;
            line-height: 1.5;
            margin: 15px 0;
            border: 1px solid #e2e8f0;
            font-size: 11pt;
            overflow-x: auto;
          }
          pre code {
            background-color: transparent;
            padding: 0;
            font-size: 11pt;
            white-space: pre-wrap;
            display: block;
            font-family: inherit;
            color: #475569;
            line-height: inherit;
          }
          ul, ol {
            margin: 15px 0;
            padding-left: 25px;
          }
          li {
            margin: 5px 0;
            line-height: 1.6;
          }
          blockquote {
            margin: 15px 0;
            padding: 10px 20px;
            border-left: 4px solid #e2e8f0;
            background-color: #f8fafc;
            font-style: italic;
          }
          code {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            background-color: #f1f5f9;
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 10pt;
            color: #1e293b;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        ${contentHtml}
      </body>
    </html>
  `;

  const fileBuffer = await htmlToDocx(fullHtml);

  return new Response(fileBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
  });
}
