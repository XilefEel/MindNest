import {
  useEditor,
  EditorContent,
  EditorContext,
  useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useMemo, useRef, useState } from "react";
import ToolBar from "./NoteMenu";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
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
import { useNoteFontSize, useNoteWidth } from "@/stores/useSettingsStore";
import { cn } from "@/lib/utils/general";
import confetti from "canvas-confetti";

const widthClasses = {
  narrow: "max-w-150",
  normal: "max-w-200",
  wide: "max-w-250",
} as const;

export default function NoteEditor() {
  const activeNestling = useActiveNestling();
  const { updateNestling } = useNestlingActions();
  const [title, setTitle] = useState(activeNestling?.title ?? "");
  const [content, setContent] = useState({});

  const noteFontSize = useNoteFontSize();
  const noteWidth = useNoteWidth();

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
      Typography,
      SlashCommand,
      Placeholder.configure({
        placeholder: "Start typing or press '/' for commands...",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "max-w-none min-h-full outline-none focus:outline-none text-zinc-900 dark:text-zinc-100",
      },
    },
  });

  const { wordCount, taskStats } = useEditorState({
    editor,
    selector: (ctx) => {
      let total = 0;
      let completed = 0;

      ctx.editor.state.doc.descendants((node) => {
        if (node.type.name === "taskItem") {
          total++;
          if (node.attrs.checked) {
            completed++;
          }
        }
      });

      return {
        wordCount: ctx.editor.storage.characterCount.words(),
        taskStats: { total, completed },
      };
    },
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

  const prevTaskStats = useRef<{ total: number; completed: number } | null>(
    null,
  );

  useEffect(() => {
    const prev = prevTaskStats.current;

    if (prev === null) {
      prevTaskStats.current = taskStats;
      return;
    }

    const justCompleted =
      prev.total > 0 &&
      prev.completed < prev.total &&
      taskStats.total > 0 &&
      taskStats.completed === taskStats.total;

    if (justCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 1 },
      });
    }

    prevTaskStats.current = taskStats;
  }, [taskStats]);

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
          <div
            className={cn(
              "mx-auto flex w-full max-w-200 flex-col",
              widthClasses[noteWidth],
            )}
          >
            <EditorContent
              editor={editor}
              className="tiptap w-full"
              data-text-size={noteFontSize}
            />
            {editor && <CustomBubbleMenu editor={editor} />}
          </div>
        </div>

        <BottomBar
          autoSaveStatus={autoSaveStatus}
          wordCount={wordCount}
          taskStats={taskStats}
        />
      </div>
    </EditorContext.Provider>
  );
}
