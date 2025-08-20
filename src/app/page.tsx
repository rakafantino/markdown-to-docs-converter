"use client";

import { useState } from "react";
import { remark } from "remark";
import html from "remark-html";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileText, Download, Loader2, ChevronDown } from "lucide-react";

export default function Home() {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Converter

This is a **powerful** markdown to document converter that supports:

## Features
- Convert to PDF
- Convert to DOCX
- Real-time preview
- Code syntax highlighting

### Code Example
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

> This tool makes document conversion simple and efficient!`);
  const [filename, setFilename] = useState("document");
  const [isConverting, setIsConverting] = useState(false);
  const [convertingType, setConvertingType] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [previewFormat, setPreviewFormat] = useState<"pdf" | "docx">("pdf");

  const getPreviewContent = () => {
    if (!markdown) {
      return '<p class="text-slate-500">Preview will appear here...</p>';
    }

    const processedContent = remark().use(html).processSync(markdown).toString();

    if (previewFormat === "pdf") {
      // Apply PDF-specific styling inline with dark mode support
      return `<style>
        .pdf-preview { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; line-height: 1.6; }
        .pdf-preview h1 { font-size: 2em; font-weight: 700; margin-bottom: 0.8em; margin-top: 0; line-height: 1.2; }
        .pdf-preview h2 { font-size: 1.5em; font-weight: 600; margin-bottom: 0.75em; margin-top: 2em; line-height: 1.3; }
        .pdf-preview h3 { font-size: 1.25em; font-weight: 600; margin-bottom: 0.6em; margin-top: 1.6em; line-height: 1.6; }
        .pdf-preview p { margin-bottom: 1.25em; margin-top: 1.25em; }
        .pdf-preview strong { font-weight: 600; }
        .pdf-preview ul { margin-bottom: 1.25em; margin-top: 1.25em; padding-left: 1.625em; list-style-type: disc; }
        .pdf-preview ol { margin-bottom: 1.25em; margin-top: 1.25em; padding-left: 1.625em; list-style-type: decimal; }
        .pdf-preview li { margin-bottom: 0.5em; margin-top: 0.5em; line-height: 1.7; display: list-item; }
        .pdf-preview blockquote { font-style: italic; margin-bottom: 1.6em; margin-top: 1.6em; padding-left: 1em; border-left: 0.25em solid #e2e8f0; }
        .pdf-preview code { background-color: #f1f5f9; padding: 0.2em 0.4em; border-radius: 0.25rem; font-size: 0.875em; font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace; color: #1e293b; font-weight: 600; }
        .pdf-preview pre { background-color: #f8fafc; border-radius: 0.5rem; padding: 1.25em 1.5em; margin-bottom: 1.75em; margin-top: 1.75em; overflow-x: auto; border: 1px solid #e2e8f0; }
        .pdf-preview pre code { background-color: transparent; padding: 0; font-size: 0.875em; font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace; color: #475569; line-height: 1.7; white-space: pre; }
        
        /* Dark mode styles */
        @media (prefers-color-scheme: dark) {
          .pdf-preview { color: #e2e8f0; }
          .pdf-preview blockquote { border-left-color: #475569; }
          .pdf-preview code { background-color: #334155; color: #e2e8f0; }
          .pdf-preview pre { background-color: #1e293b; border-color: #475569; }
          .pdf-preview pre code { color: #cbd5e1; }
        }
      </style><div class="pdf-preview">${processedContent}</div>`;
    } else if (previewFormat === "docx") {
      // Apply DOCX-specific styling inline with dark mode support
      return `<style>
        .docx-preview { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; }
        .docx-preview h1 { font-size: 22pt; font-weight: normal; margin-bottom: 12pt; margin-top: 0; }
        .docx-preview h2 { font-size: 18pt; font-weight: normal; margin-bottom: 12pt; margin-top: 24pt; }
        .docx-preview h3 { font-size: 16pt; font-weight: normal; margin-bottom: 12pt; margin-top: 18pt; }
        .docx-preview p { margin-bottom: 10pt; margin-top: 10pt; }
        .docx-preview ul, .docx-preview ol { margin: 15pt 0; padding-left: 25pt; }
        .docx-preview li { margin: 5pt 0; line-height: 1.6; }
        .docx-preview blockquote { margin: 15pt 0; padding: 10pt 20pt; border-left: 4px solid #e2e8f0; background-color: #f8fafc; font-style: italic; }
        .docx-preview code { font-family: 'Consolas', 'Monaco', 'Courier New', monospace; background-color: #f1f5f9; padding: 3pt 6pt; border-radius: 4px; font-size: 10pt; color: #1e293b; font-weight: 600; }
        .docx-preview pre { background-color: #f8fafc; padding: 15pt; border-radius: 6px; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; white-space: pre-wrap; line-height: 1.5; margin: 15pt 0; border: 1px solid #e2e8f0; font-size: 11pt; overflow-x: auto; }
        .docx-preview pre code { background-color: transparent; padding: 0; font-size: 11pt; white-space: pre-wrap; display: block; font-family: inherit; color: #475569; line-height: inherit; }
        
        /* Dark mode styles */
        @media (prefers-color-scheme: dark) {
          .docx-preview { color: #e2e8f0; }
          .docx-preview blockquote { border-left-color: #475569; background-color: #1e293b; }
          .docx-preview code { background-color: #334155; color: #e2e8f0; }
          .docx-preview pre { background-color: #1e293b; border-color: #475569; }
          .docx-preview pre code { color: #cbd5e1; }
        }
      </style><div class="docx-preview">${processedContent}</div>`;
    }

    return processedContent;
  };

  const handleConvertToPdf = async () => {
    setIsConverting(true);
    setConvertingType("PDF");
    setProgress(0);

    try {
      setProgress(20);
      const processedContent = await remark().use(html).process(markdown);
      const contentHtml = processedContent.toString();

      setProgress(40);
      const element = document.createElement("div");
      // Apply the same styling as the live preview
      element.className = "prose prose-slate max-w-none p-4 bg-white";
      element.style.cssText = `
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        line-height: 1.7;
        color: #334155;
        width: 800px;
        padding: 32px;
        background: white;
      `;

      // Add comprehensive CSS for proper formatting
      const style = document.createElement("style");
      style.textContent = `
        .prose h1 { font-size: 2.25em; font-weight: 800; margin-bottom: 0.8888889em; margin-top: 0; line-height: 1.1111111; }
        .prose h2 { font-size: 1.5em; font-weight: 700; margin-bottom: 1em; margin-top: 2em; line-height: 1.3333333; }
        .prose h3 { font-size: 1.25em; font-weight: 600; margin-bottom: 0.6em; margin-top: 1.6em; line-height: 1.6; }
        .prose p { margin-bottom: 1.25em; margin-top: 1.25em; }
        .prose strong { font-weight: 600; }
        .prose ul { margin-bottom: 1.25em; margin-top: 1.25em; padding-left: 1.625em; list-style-type: disc; }
        .prose ul li { display: list-item; margin-left: 0; padding-left: 0; }
        .prose ol { margin-bottom: 1.25em; margin-top: 1.25em; padding-left: 1.625em; list-style-type: decimal; }
        .prose ol li { display: list-item; margin-left: 0; padding-left: 0; }
        .prose li { margin-bottom: 0.5em; margin-top: 0.5em; line-height: 1.7; }
        .prose ul ul, .prose ol ol, .prose ul ol, .prose ol ul { margin-top: 0.75em; margin-bottom: 0.75em; }
        .prose li p { margin-top: 0.75em; margin-bottom: 0.75em; }
        .prose blockquote { font-style: italic; margin-bottom: 1.6em; margin-top: 1.6em; padding-left: 1em; border-left: 0.25em solid #e2e8f0; }
        .prose code { 
          background-color: #f1f5f9; 
          padding: 0.2em 0.4em; 
          border-radius: 0.25rem; 
          font-size: 0.875em; 
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
          color: #1e293b;
          font-weight: 600;
        }
        .prose pre { 
          background-color: #f8fafc; 
          border-radius: 0.5rem; 
          padding: 1.25em 1.5em; 
          margin-bottom: 1.75em; 
          margin-top: 1.75em; 
          overflow-x: auto;
          border: 1px solid #e2e8f0;
        }
        .prose pre code { 
          background-color: transparent; 
          padding: 0; 
          color: #475569; 
          font-size: 0.875em; 
          font-weight: 400;
          line-height: 1.7142857;
        }
      `;
      document.head.appendChild(style);

      element.innerHTML = contentHtml;
      document.body.appendChild(element);

      setProgress(60);
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 800,
        height: element.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/png");

      setProgress(80);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Handle multiple pages if content is too long
      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      setProgress(100);
      pdf.save(`${filename}.pdf`);

      // Delay cleanup to allow user to see the preview briefly
      setTimeout(() => {
        try {
          if (document.body.contains(element)) {
            document.body.removeChild(element);
          }
          if (document.head.contains(style)) {
            document.head.removeChild(style);
          }
        } catch (cleanupError) {
          console.warn("Cleanup error:", cleanupError);
        }
      }, 2000); // Wait 2 seconds before cleanup
    } catch (error) {
      console.error("Error converting to PDF:", error);
    } finally {
      setTimeout(() => {
        setIsConverting(false);
        setConvertingType(null);
        setProgress(0);
      }, 500);
    }
  };

  const handleConvertToDocx = async () => {
    setIsConverting(true);
    setConvertingType("DOCX");
    setProgress(0);

    try {
      setProgress(30);
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markdown }),
      });

      setProgress(70);
      if (!response.ok) {
        throw new Error("Failed to convert to DOCX");
      }

      const blob = await response.blob();
      setProgress(100);
      saveAs(blob, `${filename}.docx`);
    } catch (error) {
      console.error("Error converting to DOCX:", error);
    } finally {
      setTimeout(() => {
        setIsConverting(false);
        setConvertingType(null);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-slate-600 dark:text-slate-400" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">Markdown Converter</h1>
            </div>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4 sm:px-0">Transform your markdown content into professional PDF and DOCX documents with ease</p>
          </div>
          <div className="sm:ml-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Input Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Markdown Input
              </CardTitle>
              <CardDescription>Write or paste your markdown content below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="Enter your markdown here..." value={markdown} onChange={(e) => setMarkdown(e.target.value)} className="min-h-[300px] sm:min-h-[400px] font-mono text-sm" />

              <div className="space-y-2">
                <label className="text-sm font-medium">Filename</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="flex-1 px-3 py-2 sm:py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-800 text-sm sm:text-base"
                    placeholder="document"
                  />
                  <Badge variant="secondary" className="px-3 py-2">
                    {markdown.length} chars
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <div className="space-y-6">
            {/* Conversion Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Options
                </CardTitle>
                <CardDescription>Choose your preferred document format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                {isConverting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Converting to {convertingType}...
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Button onClick={handleConvertToPdf} disabled={isConverting || !markdown.trim()} className="h-11 sm:h-12 flex items-center gap-2 text-sm sm:text-base" variant="default">
                    {isConverting && convertingType === "PDF" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                    Export as PDF
                  </Button>

                  <Button onClick={handleConvertToDocx} disabled={isConverting || !markdown.trim()} className="h-11 sm:h-12 flex items-center gap-2 text-sm sm:text-base" variant="outline">
                    {isConverting && convertingType === "DOCX" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                    Export as DOCX
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview Section */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="mb-1">Preview</CardTitle>
                    <CardDescription>See how your markdown will look when converted</CardDescription>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-1 sm:gap-2 h-9 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm w-full sm:w-auto max-w-[120px] sm:max-w-none">
                          <span className="truncate">
                            {previewFormat === "pdf" && "PDF Style"}
                            {previewFormat === "docx" && "DOCX Style"}
                          </span>
                          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-28 sm:w-32">
                        <DropdownMenuItem onClick={() => setPreviewFormat("pdf")} className="py-2 px-2 text-xs sm:text-sm">
                          PDF Style
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPreviewFormat("docx")} className="py-2 px-2 text-xs sm:text-sm">
                          DOCX Style
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="max-w-none p-3 sm:p-4 border rounded-lg max-h-[300px] sm:max-h-[400px] overflow-y-auto text-sm sm:text-base bg-white dark:bg-slate-900"
                  dangerouslySetInnerHTML={{
                    __html: getPreviewContent(),
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <Separator className="my-8" />
        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          <p>Built with Next.js, Tailwind CSS, and shadcn/ui</p>
          <br />
          <p>
            Made with ❤️ by <a href="https://github.com/rakafantino">Raka Fantino</a>
          </p>
        </div>
      </div>
    </div>
  );
}
