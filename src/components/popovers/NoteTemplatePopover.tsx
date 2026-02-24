import BasePopover from "@/components/popovers/BasePopover.tsx";
import { useEffect, useRef, useState } from "react";
import ToolBarItem from "@/components/editors/note/ToolBarItem.tsx";
import { FilePen, Trash2, Check } from "lucide-react";
import { useNoteActions, useTemplates } from "@/stores/useNoteStore.tsx";
import { useActiveNestling } from "@/stores/useNestlingStore.tsx";
import { cn } from "@/lib/utils/general";

export default function NoteTemplatePopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const { getTemplates, addTemplate, useTemplate, deleteTemplate } =
    useNoteActions();
  const noteTemplates = useTemplates();

  const handleSaveAsTemplate = async () => {
    const name = templateName.trim() || `Template ${noteTemplates.length + 1}`;
    try {
      await addTemplate({
        nestlingId: activeNestling.id,
        name,
        content: activeNestling.content,
      });
      setIsSaving(false);
      setTemplateName("");
    } catch (error) {
      console.error("Failed to save template:", error);
    }
  };

  useEffect(() => {
    if (isSaving) {
      inputRef.current?.focus();
    }
  }, [isSaving]);

  useEffect(() => {
    if (isOpen && activeNestling.id) {
      getTemplates(activeNestling.id);
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
            <div className="space-y-0.5">
              {noteTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => useTemplate(activeNestling.id, template)}
                  className="group flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50"
                >
                  <span className="truncate text-sm text-gray-700 dark:text-gray-200">
                    {template.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTemplate(template.id);
                    }}
                    className="rounded p-0.5 text-gray-600 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500 dark:text-gray-400"
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

          <div className="mt-2 flex flex-col gap-2 border-t border-gray-200 pt-2 dark:border-gray-700">
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
