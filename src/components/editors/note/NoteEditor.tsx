import { useEditor, EditorContent, EditorContext } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMemo, useState } from "react";
import ToolBar from "./ToolBar";
import CustomBubbleMenu from "./CustomBubbleMenu";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import useAutoSave from "@/hooks/useAutoSave";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import NestlingTitle from "../NestlingTitle";

export default function NoteEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link,
      Image,
    ],
    content: "<p>Hello World!</p>",
    editorProps: {
      attributes: {
        class: "h-full prose min-h-full outline-none focus:outline-none",
      },
    },
  });

  const providerValue = useMemo(() => ({ editor }), [editor]);

  const activeNestling = useActiveNestling();
  if (!activeNestling) return;
  const { updateNestling } = useNestlingActions();

  const [title, setTitle] = useState(activeNestling.title);

  const nestlingData = useMemo(() => ({ title }), [title]);

  const autoSaveStatus = useAutoSave(
    activeNestling.id!,
    nestlingData,
    updateNestling,
  );

  return (
    <div className="flex h-full w-full flex-col gap-5 overflow-hidden">
      <NestlingTitle
        title={title}
        setTitle={setTitle}
        nestling={activeNestling}
      />

      <EditorContext.Provider value={providerValue}>
        <ToolBar />
        <EditorContent editor={editor} className="flex-1 overflow-auto" />
        <CustomBubbleMenu />
      </EditorContext.Provider>
    </div>
  );
}

// import ReactMarkdown from "react-markdown";
// import ToolBar from "./ToolBar";
// import BottomBar from "./BottomBar";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { BookOpen, Pencil } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNoteStore } from "@/stores/useNoteStore";
// import { useHotkeys } from "react-hotkeys-hook";
// import useAutoSave from "@/hooks/useAutoSave";
// import NestlingTitle from "../NestlingTitle";
// import { cn } from "@/lib/utils/general";
// import { useActiveBackgroundId } from "@/stores/useNestStore";
// import {
//   useActiveNestling,
//   useNestlingActions,
// } from "@/stores/useNestlingStore";

// export default function NoteEditor() {
//   const activeNestling = useActiveNestling();
//   if (!activeNestling) return;
//   const { updateNestling } = useNestlingActions();

//   const [title, setTitle] = useState(activeNestling.title);
//   const [previewMode, setPreviewMode] = useState(false);

//   const content = useNoteStore((s) => s.present);
//   const { updateNote, undo, redo } = useNoteStore();
//   const activeBackgroundId = useActiveBackgroundId();

//   const nestlingData = useMemo(() => ({ title, content }), [title, content]);

//   const autoSaveStatus = useAutoSave(
//     activeNestling.id!,
//     nestlingData,
//     updateNestling,
//   );

//   const textareaRef = useRef<HTMLTextAreaElement | null>(null);

//   const applyFormatting = (type: string) => {
//     const textarea = textareaRef.current;
//     if (!textarea) return;

//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selected = content.slice(start, end);

//     let syntaxBefore = "";
//     let syntaxAfter = "";

//     switch (type) {
//       case "undo":
//         undo();
//         return;
//       case "redo":
//         redo();
//         return;
//       case "bold":
//         syntaxBefore = "**";
//         syntaxAfter = "**";
//         break;
//       case "italic":
//         syntaxBefore = "*";
//         syntaxAfter = "*";
//         break;
//       case "strikethrough":
//         syntaxBefore = "~~";
//         syntaxAfter = "~~";
//         break;
//       case "code":
//         syntaxBefore = "`";
//         syntaxAfter = "`";
//         break;
//       case "blockquote":
//         syntaxBefore = "> ";
//         break;
//       case "ul":
//         syntaxBefore = "- ";
//         break;
//       case "ol":
//         syntaxBefore = "1. ";
//         break;
//       case "h1":
//         syntaxBefore = "# ";
//         break;
//       case "h2":
//         syntaxBefore = "## ";
//         break;
//       case "h3":
//         syntaxBefore = "### ";
//         break;

//       case "link":
//         syntaxBefore = "[";
//         syntaxAfter = "](url)";
//         break;
//       case "image":
//         syntaxBefore = "![";
//         syntaxAfter = "](image-url)";
//         break;
//       default:
//         return;
//     }

//     const newText =
//       content.slice(0, start) +
//       syntaxBefore +
//       selected +
//       syntaxAfter +
//       content.slice(end);

//     updateNote(newText);

//     setTimeout(() => {
//       textarea.focus();
//       textarea.setSelectionRange(
//         start + syntaxBefore.length,
//         end + syntaxBefore.length,
//       );
//     }, 0);
//   };

//   useEffect(() => {
//     if (activeNestling) {
//       setTitle(activeNestling.title);
//       updateNote(activeNestling.content);
//     }
//   }, [activeNestling]);

//   useHotkeys("ctrl+z", undo, [undo]);
//   useHotkeys("ctrl+shift+z, ctrl+y", redo, [redo]);

//   return (
//     <div className="flex h-full w-full flex-col space-y-2 overflow-hidden">
//       <NestlingTitle
//         title={title}
//         setTitle={setTitle}
//         nestling={activeNestling}
//       />

//       <div
//         className={cn(
//           "flex justify-between rounded-lg px-3",
//           activeBackgroundId
//             ? "bg-white/30 backdrop-blur-sm dark:bg-black/30"
//             : "bg-white dark:bg-gray-800",
//         )}
//       >
//         <ToolBar onFormat={applyFormatting} />
//         <button
//           onClick={() => setPreviewMode(!previewMode)}
//           className="cursor-pointer transition-all duration-200 hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300"
//         >
//           {previewMode ? (
//             <Pencil className="size-4" />
//           ) : (
//             <BookOpen className="size-4" />
//           )}
//         </button>
//       </div>

//       <AnimatePresence>
//         <div className="flex-1">
//           <AnimatePresence mode="wait">
//             {previewMode ? (
//               <motion.div
//                 key="preview"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.2 }}
//                 className="prose dark:prose-invert max-w-none"
//               >
//                 <ReactMarkdown>
//                   {content || "*Nothing to preview yet.*"}
//                 </ReactMarkdown>
//               </motion.div>
//             ) : (
//               <motion.textarea
//                 key="edit"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.2 }}
//                 value={content}
//                 onChange={(e) => updateNote(e.target.value)}
//                 ref={textareaRef}
//                 placeholder="Start typing..."
//                 className="h-full w-full resize-none bg-transparent text-base leading-relaxed outline-none"
//               />
//             )}
//           </AnimatePresence>
//         </div>
//       </AnimatePresence>

//       <div
//         className={cn(
//           "flex justify-between rounded-lg px-3",
//           activeBackgroundId
//             ? "bg-white/30 backdrop-blur-sm dark:bg-black/30"
//             : "bg-white dark:bg-gray-800",
//         )}
//       >
//         <BottomBar autoSaveStatus={autoSaveStatus} content={content} />
//       </div>
//     </div>
//   );
// }
