import {
  useEditor,
  EditorContent,
  EditorContext,
  useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useMemo, useState } from "react";
import ToolBar from "./ToolBar";
import CustomBubbleMenu from "./CustomBubbleMenu";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Dropcursor } from "@tiptap/extensions";
import Youtube from "@tiptap/extension-youtube";
import { CharacterCount } from "@tiptap/extensions";
import useAutoSave from "@/hooks/useAutoSave";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import NestlingTitle from "../NestlingTitle";
import { cn } from "@/lib/utils/general";
import BottomBar from "./BottomBar";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export default function NoteEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return;
  const { updateNestling } = useNestlingActions();

  const [title, setTitle] = useState(activeNestling.title);
  const [content, setContent] = useState({});
  const activeBackgroundId = useActiveBackgroundId();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        enableClickSelection: true,
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
    ],
    content: "<p>Start writing here...</p>",
    editorProps: {
      attributes: {
        class:
          "h-full max-w-none prose dark:prose-invert min-h-full outline-none focus:outline-none text-gray-900 dark:text-gray-100",
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
    activeNestling.id,
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
    if (!activeNestling.content) return;

    const noteContent = JSON.parse(activeNestling.content);
    editor.commands.setContent(noteContent);
    setContent(noteContent);
  }, [editor, activeNestling.content]);

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <NestlingTitle
        title={title}
        setTitle={setTitle}
        nestling={activeNestling}
      />

      <EditorContext.Provider value={providerValue}>
        <ToolBar title={activeNestling.title} />
        <EditorContent
          editor={editor}
          className="w-full flex-1 overflow-auto"
        />
        <CustomBubbleMenu />
      </EditorContext.Provider>

      <div
        className={cn(
          "flex justify-between rounded-lg px-3",
          activeBackgroundId
            ? "bg-white/30 backdrop-blur-sm dark:bg-black/30"
            : "bg-white dark:bg-gray-800",
        )}
      >
        <BottomBar autoSaveStatus={autoSaveStatus} wordCount={wordCount} />
      </div>
    </div>
  );
}
