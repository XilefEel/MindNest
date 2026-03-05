import BasePopover from "@/components/popovers/BasePopover.tsx";
import { useEffect, useRef, useState } from "react";
import ToolBarItem from "@/components/editors/note/ToolBarItem.tsx";
import { FilePen, Trash2, Check } from "lucide-react";
import { useNoteActions, useTemplates } from "@/stores/useNoteStore.tsx";
import { useActiveNestling } from "@/stores/useNestlingStore.tsx";
import { cn } from "@/lib/utils/general";
import { useActiveBackgroundId, useActiveNestId } from "@/stores/useNestStore";
import { toast } from "@/lib/utils/toast";
import { useCurrentEditor } from "@tiptap/react";
import { NoteTemplate } from "@/lib/types/note";

export default function NoteTemplatePopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const activeNestId = useActiveNestId();
  const activeNestling = useActiveNestling();
  if (!activeNestling || !activeNestId) return;

  const activeBackgroundId = useActiveBackgroundId();

  const { getTemplates, addTemplate, useTemplate, deleteTemplate } =
    useNoteActions();
  const noteTemplates = useTemplates();

  const { editor } = useCurrentEditor();
  if (!editor) return;

  const handleSaveAsTemplate = async () => {
    const name = templateName.trim() || `Template ${noteTemplates.length + 1}`;
    try {
      await addTemplate({
        nestId: activeNestId,
        name,
        content: activeNestling.content,
      });
      setIsSaving(false);
      setTemplateName("");
    } catch (error) {
      toast.error("Failed to save template.");
    }
  };

  const handleUseTemplate = async (template: NoteTemplate) => {
    try {
      await useTemplate(activeNestling.id, template);
      editor.commands.setContent(JSON.parse(template.content));
    } catch (error) {
      toast.error("Failed to use template.");
    }
  };

  useEffect(() => {
    if (isSaving) {
      inputRef.current?.focus();
    }
  }, [isSaving]);

  useEffect(() => {
    if (isOpen && activeNestId) {
      getTemplates(activeNestId);
    } else {
      setIsSaving(false);
      setTemplateName("");
    }
  }, [isOpen]);

  return (
    <BasePopover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      align="end"
      trigger={
        <button>
          <ToolBarItem
            Icon={FilePen}
            label="Use Template"
            onFormat={() => console.log("Use Template")}
          />
        </button>
      }
      content={
        <>
          {noteTemplates.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              {noteTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleUseTemplate(template)}
                  className={cn(
                    "group flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50",
                    activeBackgroundId &&
                      "hover:bg-white/30 hover:dark:bg-black/30",
                  )}
                >
                  <span className="truncate text-sm text-gray-700 dark:text-gray-200">
                    {template.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTemplate(template.id);
                    }}
                    className="rounded p-0.5 text-gray-600 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-2 py-5 text-center text-xs text-gray-600 dark:text-gray-400">
              No templates yet
            </div>
          )}

          <div
            className={cn(
              "mt-2 flex flex-col gap-2 border-t border-gray-200 pt-2 dark:border-gray-700",
              activeBackgroundId && "border-black/30 dark:border-white/30",
            )}
          >
            <label className="text-xs text-gray-600 dark:text-gray-400">
              Save as template
            </label>
            <div className="flex items-center gap-2">
              <input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveAsTemplate();
                }}
                placeholder={`Template ${noteTemplates.length + 1}`}
                className={cn(
                  "min-w-0 flex-1 rounded border bg-transparent px-2 py-1 text-sm transition outline-none",
                  "text-gray-800 dark:text-gray-100",
                  "border-gray-200 focus:border-teal-500 dark:border-gray-600 dark:focus:border-teal-400",
                  "focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400",
                  activeBackgroundId &&
                    "border-0 bg-white/10 backdrop-blur-sm dark:bg-black/10",
                )}
              />
              <button
                onClick={handleSaveAsTemplate}
                className="rounded p-1 text-gray-600 transition-colors hover:text-green-500 dark:text-gray-400"
              >
                <Check size={16} />
              </button>
            </div>
          </div>
        </>
      }
    />
  );
}
