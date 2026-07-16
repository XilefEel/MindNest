import { save } from "@tauri-apps/plugin-dialog";
import type { Editor, Range } from "@tiptap/react";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { toast } from "@/lib/utils/toast";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Code,
  Minus,
  LucideIcon,
} from "lucide-react";
import { Extension } from "@tiptap/core";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import {
  SlashCommandMenu,
  SlashCommandMenuHandle,
} from "@/components/editors/note/SlashCommandMenu";

export const getActiveIcon = <T>(
  items: readonly { active: boolean; icon: T }[],
  fallback: T,
) => {
  return items.find((item) => item.active)?.icon ?? fallback;
};

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
      font-size: 1rem;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.75;
      color: #27272a; /* zinc-800 */
    }
    h1, h2, h3, h4 {
      font-weight: 700;
      line-height: 1.2;
    }
    h1 { font-size: 1.875rem; margin-top: 2.5rem; margin-bottom: 0.75rem; }
    h2 { font-size: 1.5rem; margin-top: 2rem; margin-bottom: 0.6rem; }
    h3 { font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
    h4 { font-size: 1.0625rem; margin-top: 1.25rem; margin-bottom: 0.5rem; }
    h1:first-child, h2:first-child, h3:first-child, h4:first-child {
      margin-top: 0;
    }
    p { margin: 0.75rem 0; }
    ul, ol {
      padding-left: 1.5rem;
      margin: 0.75rem 0;
    }
    li { margin: 0.2rem 0; }
    li p { margin: 0; }
    hr {
      margin: 2rem 0;
      border: none;
      border-top: 1px solid #e4e4e7;
    }
    blockquote {
      border-left: 4px solid #2dd4bf;
      margin: 1.25rem 0;
      margin-left: 0;
      padding-left: 1rem;
      color: #52525b;
      font-style: normal;
    }
    code {
      font-family: inherit;
      font-size: 0.9em;
      background: #f4f4f5;
      padding: 0.15rem 0.35rem;
      border-radius: 0.375rem;
    }
    pre {
      margin: 1.25rem 0;
      background: #18181b;
      color: #e4e4e7;
      padding: 1rem;
      border-radius: 0.75rem;
      overflow-x: auto;
    }
    pre code {
      background: none;
      padding: 0;
      font-size: 0.9rem;
      color: inherit;
    }
    img {
      display: block;
      max-width: 100%;
      height: auto;
      border-radius: 0.75rem;
      margin: 1.5rem auto;
    }
    mark {
      background: #ccfbf1;
      color: inherit;
      padding: 0.05rem 0.15rem;
      border-radius: 0.25rem;
    }
    iframe {
      max-width: 100%;
      aspect-ratio: 16/9;
    }
    @media (prefers-color-scheme: dark) {
      body { background: #1a1a1a; color: #f4f4f5;
      hr { border-top-color: #3f3f46; }
      blockquote { border-left-color: #14b8a6; color: #a1a1aa; }
      code { background: #27272a; }
      pre { background: #18181b; }
      mark { background: #0f766e; color: #fef9c3; }
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

export type CommandItemType = {
  title: string;
  Icon: LucideIcon;
  command: (opts: { editor: Editor; range: Range }) => void;
};

export const suggestionItems: CommandItemType[] = [
  {
    title: "Heading 1",
    Icon: Heading1,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run(),
  },
  {
    title: "Heading 2",
    Icon: Heading2,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run(),
  },
  {
    title: "Heading 3",
    Icon: Heading3,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run(),
  },
  {
    title: "Bullet List",
    Icon: List,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numbered List",
    Icon: ListOrdered,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "Task List",
    Icon: ListTodo,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    title: "Quote",
    Icon: Quote,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: "Code Block",
    Icon: Code,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Divider",
    Icon: Minus,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
];

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: false,
        items: ({ query }: { query: string }) =>
          suggestionItems.filter((item) =>
            item.title.toLowerCase().startsWith(query.toLowerCase()),
          ),
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
        render: () => {
          let component: ReactRenderer<SlashCommandMenuHandle> | null = null;

          return {
            onStart: (props) => {
              component = new ReactRenderer(SlashCommandMenu, {
                props,
                editor: props.editor,
              });
            },
            onUpdate: (props) => {
              component?.updateProps(props);
            },
            onKeyDown: (props) => {
              if (props.event.key === "Escape") {
                component?.destroy();
                return true;
              }
              return component?.ref?.onKeyDown(props) ?? false;
            },
            onExit: () => {
              component?.destroy();
              component = null;
            },
          };
        },
      } satisfies Partial<SuggestionOptions<CommandItemType>>,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
