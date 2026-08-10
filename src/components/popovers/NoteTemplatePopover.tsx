import { useEffect, useState } from "react";
import { Trash2, Check } from "lucide-react";
import { useNoteActions, useTemplates } from "@/stores/useNoteStore.tsx";
import { useActiveNestling } from "@/stores/useNestlingStore.tsx";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId, useActiveNestId } from "@/stores/useNestStore";
import { toast } from "@/lib/utils/toast";
import { useCurrentEditor } from "@tiptap/react";
import { NoteTemplate } from "@/lib/types/note";

export default function NoteTemplatePopover() {
  const [templateName, setTemplateName] = useState("");

  const activeNestId = useActiveNestId();
  const activeNestling = useActiveNestling();
  const activeBackgroundId = useActiveBackgroundId();

  const noteTemplates = useTemplates();
  const { getTemplates, addTemplate, applyTemplate, deleteTemplate } =
    useNoteActions();

  const { editor } = useCurrentEditor();

  const handleSaveAsTemplate = async () => {
    if (!activeNestId || !activeNestling) return;
    const name = templateName.trim() || `Template ${noteTemplates.length + 1}`;
    try {
      await addTemplate({
        nestId: activeNestId,
        name,
        content: activeNestling.content,
      });
      setTemplateName("");
    } catch (error) {
      toast.error("Failed to save template.");
    }
  };

  const handleUseTemplate = async (template: NoteTemplate) => {
    if (!activeNestling || !editor) return;
    try {
      await applyTemplate(activeNestling.id, template);
      editor.commands.setContent(JSON.parse(template.content));
    } catch (error) {
      toast.error("Failed to use template.");
    }
  };

  useEffect(() => {
    if (activeNestId) getTemplates(activeNestId);
  }, [activeNestId, getTemplates]);

  if (!activeNestling || !editor) return;

  return (
    <>
      {noteTemplates.length > 0 ? (
        <div className="flex flex-col gap-0.5">
          {noteTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleUseTemplate(template)}
              className={cn(
                "group flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-zinc-50 disabled:opacity-40 dark:hover:bg-zinc-700/50",
                activeBackgroundId && "hover:bg-black/5 dark:hover:bg-white/5",
              )}
            >
              <span className="truncate text-sm leading-tight text-zinc-700 dark:text-zinc-200">
                {template.name}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTemplate(template.id);
                }}
                className={cn(
                  "text-zinc-500 opacity-0 transition-colors group-hover:opacity-100 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400",
                  activeBackgroundId &&
                    "hover:bg-black/5 dark:hover:bg-white/5",
                )}
              >
                <Trash2 className="size-3.5 shrink-0" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-2 py-5 text-center text-xs text-zinc-600 dark:text-zinc-400">
          No templates yet
        </div>
      )}

      <div
        className={cn(
          "mt-2 flex flex-col gap-2 border-t border-zinc-200 pt-2 dark:border-zinc-700",
          activeBackgroundId && "border-black/30 dark:border-white/30",
        )}
      >
        <span className="text-xs text-zinc-600 dark:text-zinc-400">
          Save as template
        </span>

        <div className="flex items-center gap-2">
          <input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveAsTemplate();
            }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={`Template ${noteTemplates.length + 1}`}
            className={cn(
              "min-w-0 flex-1 rounded border bg-transparent px-2 py-1 text-sm transition outline-none",
              "text-zinc-800 dark:text-zinc-100",
              "border-zinc-200 focus:border-teal-500 dark:border-zinc-600 dark:focus:border-teal-400",
              "focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400",
              activeBackgroundId &&
                "border-transparent bg-white/10 backdrop-blur-sm dark:border-transparent dark:bg-black/10",
            )}
          />
          <button
            onClick={handleSaveAsTemplate}
            className="p-1 text-zinc-500 transition-colors hover:text-green-500 dark:text-zinc-400"
          >
            <Check className="size-4 shrink-0" />
          </button>
        </div>
      </div>
    </>
  );
}
