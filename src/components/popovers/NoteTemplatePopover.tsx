import BasePopover from "@/components/popovers/BasePopover.tsx";
import { useEffect, useState } from "react";
import ToolBarItem from "@/components/editors/note/ToolBarItem.tsx";
import { FilePen, Trash2, Plus } from "lucide-react";
import { useNoteActions, useTemplates } from "@/stores/useNoteStore.tsx";
import { useActiveNestling } from "@/stores/useNestlingStore.tsx";

export default function NoteTemplatePopover() {
  const [isOpen, setIsOpen] = useState(false);

  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const { getTemplates, addTemplate, useTemplate, deleteTemplate } =
    useNoteActions();
  const noteTemplates = useTemplates();

  const handleSaveAsTemplate = async () => {
    try {
      await addTemplate({
        nestlingId: activeNestling.id,
        name: `Template ${noteTemplates.length + 1}`,
        content: activeNestling.content,
      });
    } catch (error) {
      console.error("Failed to save template:", error);
    }
  };

  useEffect(() => {
    if (isOpen && activeNestling.id) {
      getTemplates(activeNestling.id);
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
                    className="rounded p-0.5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-2 py-3 text-center text-xs text-gray-400">
              No templates yet
            </div>
          )}

          <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700">
            <button
              onClick={handleSaveAsTemplate}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
            >
              <Plus size={16} />
              Save as Template
            </button>
          </div>
        </>
      }
    />
  );
}
