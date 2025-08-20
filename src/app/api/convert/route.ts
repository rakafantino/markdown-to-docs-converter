import { remark } from "remark";
import html from "remark-html";
import htmlToDocx from "html-to-docx";

// Function to clean up code blocks and preserve indentation
function preprocessCodeBlocks(htmlContent: string): string {
  return htmlContent.replace(/<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g, (match, attributes, content) => {
    // Decode HTML entities properly
    const decodedContent = content
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x3C;/g, "<")
      .replace(/&#x3E;/g, ">");

    // Split into lines and remove common leading whitespace
    const lines = decodedContent.split("\n");

    // Remove empty first and last lines
    if (lines[0] && lines[0].trim() === "") lines.shift();
    if (lines[lines.length - 1] && lines[lines.length - 1].trim() === "") lines.pop();

    if (lines.length === 0) return match;

    // Find minimum indentation (excluding empty lines)
    const nonEmptyLines = lines.filter((line: string) => line.trim() !== "");
    if (nonEmptyLines.length === 0) return match;

    const minIndent = Math.min(
      ...nonEmptyLines.map((line: string) => {
        const match = line.match(/^\s*/);
        return match ? match[0].length : 0;
      })
    );

    // Remove common indentation
    const cleanedLines = lines.map((line: string) => {
      if (line.trim() === "") return "";
      return line.substring(minIndent);
    });

    // Convert to proper line breaks for DOCX and preserve formatting
    const formattedLines = cleanedLines.map((line: string) => {
      if (line.trim() === "") return "<w:br/>";
      // Properly escape HTML entities for DOCX
      const escapedLine = line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;") // Convert tabs to spaces
        .replace(/  /g, "&nbsp;&nbsp;"); // Preserve double spaces
      return `<span style="display: block; font-family: 'Consolas', 'Courier New', monospace; font-size: 10pt; line-height: 1.4; color: #2d3748;">${escapedLine}</span>`;
    });

    return `<div style="background-color: #f7fafc; padding: 12pt; border: 1pt solid #e2e8f0; margin: 12pt 0; font-family: 'Consolas', 'Courier New', monospace; font-size: 10pt; line-height: 1.4;">${formattedLines.join("")}</div>`;
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
          * {
            font-family: 'Calibri', 'Arial', sans-serif !important;
          }
          body {
            font-family: 'Calibri', 'Arial', sans-serif !important;
            font-size: 11pt;
            line-height: 1.5;
            color: #2d3748;
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Calibri', 'Arial', sans-serif !important;
            font-weight: 600;
            color: #1a202c;
          }
          h1 { font-size: 20pt; margin-bottom: 12pt; }
          h2 { font-size: 16pt; margin-bottom: 10pt; margin-top: 18pt; }
          h3 { font-size: 14pt; margin-bottom: 8pt; margin-top: 14pt; }
          h4 { font-size: 12pt; margin-bottom: 6pt; margin-top: 12pt; }
          p {
            font-family: 'Calibri', 'Arial', sans-serif !important;
            margin-bottom: 8pt;
            margin-top: 0pt;
            text-align: justify;
          }
          pre {
            background-color: #f7fafc;
            padding: 12pt;
            font-family: 'Consolas', 'Courier New', monospace;
            white-space: pre-wrap;
            line-height: 1.4;
            margin: 12pt 0;
            border: 1pt solid #e2e8f0;
            font-size: 10pt;
            overflow-x: auto;
          }
          pre code {
            background-color: transparent;
            padding: 0;
            font-size: 10pt;
            white-space: pre-wrap;
            display: block;
            font-family: inherit;
            color: #2d3748;
            line-height: inherit;
          }
          ul, ol {
            font-family: 'Calibri', 'Arial', sans-serif !important;
            margin: 12pt 0;
            padding-left: 20pt;
          }
          li {
            font-family: 'Calibri', 'Arial', sans-serif !important;
            margin: 4pt 0;
            line-height: 1.5;
          }
          blockquote {
            font-family: 'Calibri', 'Arial', sans-serif !important;
            margin: 12pt 0;
            padding: 8pt 12pt;
            border-left: 3pt solid #cbd5e0;
            background-color: #f7fafc;
            font-style: italic;
            color: #4a5568;
          }
          code {
            font-family: 'Consolas', 'Courier New', monospace;
            background-color: #edf2f7;
            padding: 2pt 4pt;
            font-size: 9pt;
            color: #2d3748;
            font-weight: 600;
          }
          strong {
            font-family: 'Calibri', 'Arial', sans-serif !important;
            font-weight: 700;
            color: #1a202c;
          }
          em {
            font-family: 'Calibri', 'Arial', sans-serif !important;
            font-style: italic;
            color: #4a5568;
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
