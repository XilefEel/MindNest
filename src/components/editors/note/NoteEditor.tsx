import {
  useEditor,
  EditorContent,
  EditorContext,
  useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useMemo, useState } from "react";
import ToolBar from "./toolbar/ToolBar";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { Dropcursor } from "@tiptap/extensions";
import Youtube from "@tiptap/extension-youtube";
import { CharacterCount } from "@tiptap/extensions";
import Typography from "@tiptap/extension-typography";
import useAutoSave from "@/hooks/useAutoSave";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import NestlingTitle from "../NestlingTitle";
import BottomBar from "./BottomBar";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { SlashCommand } from "@/lib/utils/note";
import CustomBubbleMenu from "./CustomBubbleMenu";

export default function NoteEditor() {
  const activeNestling = useActiveNestling();
  const { updateNestling } = useNestlingActions();
  const [title, setTitle] = useState(activeNestling?.title ?? "");
  const [content, setContent] = useState({});

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        resize: {
          enabled: true,
          alwaysPreserveAspectRatio: true,
        },
      }),
      CharacterCount,
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
      Dropcursor,
      Typography,
      SlashCommand,
    ],
    content: "<p>Start writing here...</p>",
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm md:prose-base max-w-none min-h-full outline-none focus:outline-none text-zinc-900 dark:text-zinc-100",
      },
    },
  });

  const { wordCount } = useEditorState({
    editor,
    selector: (ctx) => ({
      wordCount: ctx.editor.storage.characterCount.words(),
    }),
  });

  const providerValue = useMemo(() => ({ editor }), [editor]);

  const nestlingData = useMemo(
    () => ({ title, content: JSON.stringify(content) }),
    [title, content],
  );

  const autoSaveStatus = useAutoSave(
    activeNestling?.id,
    nestlingData,
    updateNestling,
  );

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      setContent(editor.getJSON());
    };

    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor || !activeNestling?.content) return;
    const noteContent = JSON.parse(activeNestling.content);
    editor.commands.setContent(noteContent);
    setContent(noteContent);
  }, [editor]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!activeNestling) return null;

  return (
    <EditorContext.Provider value={providerValue}>
      <div className="flex h-full w-full flex-col gap-3">
        <div className="flex items-center justify-between">
          <NestlingTitle
            title={title}
            setTitle={setTitle}
            nestling={activeNestling}
          />
          <ToolBar title={activeNestling.title} />
        </div>

        <div
          style={{ scrollbarGutter: "stable" }}
          className="h-full min-h-0 w-full flex-1 overflow-auto"
          data-editor-scroll-container
        >
          <div className="mx-auto flex w-full max-w-200 flex-col">
            <EditorContent editor={editor} className="tiptap w-full" />
            {editor && <CustomBubbleMenu editor={editor} />}
          </div>
        </div>
        <BottomBar autoSaveStatus={autoSaveStatus} wordCount={wordCount} />
      </div>
    </EditorContext.Provider>
  );
}
