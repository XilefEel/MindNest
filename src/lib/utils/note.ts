import { save } from "@tauri-apps/plugin-dialog";
import { Editor } from "@tiptap/react";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { toast } from "@/lib/utils/toast";

export const exportNoteToHTML = async (editor: Editor, title: string) => {
  const htmlContent = editor.getHTML();

  const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 { font-size: 2em; margin-top: 0.67em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.17em; }
    ul, ol { padding-left: 1.5em; }
    blockquote {
      border-left: 3px solid #ccc;
      margin-left: 0;
      padding-left: 1em;
      color: #555;
    }
    code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
    }
    pre {
      background: #f4f4f4;
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
    }
    pre code {
      background: none;
      padding: 0;
    }
    img { max-width: 100%; height: auto; }
    mark {
      background: #fef08a;
      padding: 1px 2px;
      border-radius: 2px;
    }
    iframe {
      max-width: 100%;
      aspect-ratio: 16/9;
    }

    @media (prefers-color-scheme: dark) {
      body { background: #1a1a1a; color: #e0e0e0; }
      blockquote { border-left-color: #555; color: #aaa; }
      code, pre { background: #2a2a2a; }
      mark { background: #854d0e; color: #fef9c3; }
    }

  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
  `.trim();

  try {
    const filePath = await save({
      defaultPath: `${title}.html`,
      filters: [{ name: "HTML", extensions: ["html"] }],
    });

    if (filePath) {
      await writeTextFile(filePath, fullHTML);
      toast.success("Note exported successfully!");
    }
  } catch (error) {
    toast.error("Error exporting note.");
  }
};
