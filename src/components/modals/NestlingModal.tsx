import { useState } from "react";
import { toast } from "@/lib/utils/toast";
import {
  useNestlingActions,
  useNestlingStore,
} from "@/stores/useNestlingStore";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";
import { cn } from "@/lib/utils/general";
import { nestlingTypes } from "@/lib/utils/nestlings";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { NestlingType } from "@/lib/types/nestling";
import { useNestlingModal } from "@/stores/useModalStore";

export default function NestlingModal() {
  const {
    isNestlingOpen,
    nestlingNestId,
    nestlingFolderId,
    closeNestlingModal,
  } = useNestlingModal();

  const activeFolderId = useNestlingStore((state) => state.activeFolderId);
  const { addNestling } = useNestlingActions();
  const activeBackgroundId = useActiveBackgroundId();

  const [title, setTitle] = useState("");
  const [nestlingType, setNestlingType] = useState<NestlingType>("note");
  const [isSaving, setIsSaving] = useState(false);

  const effectiveFolderId = nestlingFolderId ?? activeFolderId;

  const handleClose = async () => {
    setTitle("");
    setNestlingType("note");
    closeNestlingModal();
  };

  const handleSaveNestling = async () => {
    if (!nestlingNestId) return;

    setIsSaving(true);
    try {
      if (!title.trim()) return;

      await addNestling({
        nestId: nestlingNestId,
        folderId: effectiveFolderId,
        title: title,
        content: "",
        icon: "",
        isPinned: false,
        nestlingType: nestlingType,
      });
      toast.success(`Nestling "${title}" created successfully!`);

      handleClose();
    } catch (error) {
      console.error("Failed to create nestling:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BaseModal
      isOpen={isNestlingOpen}
      setIsOpen={(open) => !open && closeNestlingModal()}
      onSubmit={handleSaveNestling}
      title="Create Nestling"
      description="Give your nestling a title. You can always change it later."
      body={
        <div className="space-y-6">
          <TextField
            label="Nestling Title"
            text={title}
            setText={setTitle}
            placeholder={`e.g. My ${nestlingTypes.find((type) => type.value === nestlingType)?.label || "Note"}`}
          />

          <div className="space-y-3">
            <p className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Choose Nestling Type
            </p>
            <div className="grid grid-cols-2 gap-3">
              {nestlingTypes.map((typeOption) => {
                const TypeIcon = typeOption.icon;
                const isSelected = nestlingType === typeOption.value;

                return (
                  <button
                    key={typeOption.value}
                    onClick={() => setNestlingType(typeOption.value)}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg p-4 transition-colors",
                      isSelected
                        ? activeBackgroundId
                          ? "bg-teal-300/20 shadow-md backdrop-blur-sm dark:bg-teal-400/20"
                          : "border-2 border-teal-500 bg-teal-50 shadow-md dark:bg-teal-950/30"
                        : activeBackgroundId
                          ? "bg-white/10 backdrop-blur-sm hover:bg-white/40 hover:shadow-sm dark:hover:bg-white/20"
                          : "border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-lg transition-colors duration-100",
                        isSelected
                          ? typeOption.color
                          : "bg-gray-100 dark:bg-gray-700",
                        "text-white",
                      )}
                    >
                      <TypeIcon
                        className={cn(
                          isSelected
                            ? "text-white"
                            : "text-gray-800 dark:text-gray-300",
                        )}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p
                        className={cn(
                          "text-sm font-medium transition-colors",
                          isSelected
                            ? "text-teal-700 dark:text-teal-300"
                            : "text-gray-800 dark:text-gray-300",
                        )}
                      >
                        {typeOption.label}
                      </p>
                    </div>
                    {isSelected && (
                      <div
                        className={cn(
                          "absolute top-2 right-2 size-2 rounded-full",
                          typeOption.color,
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      }
      footer={
        <button
          onClick={handleSaveNestling}
          disabled={isSaving || !title.trim()}
          className="flex items-center rounded-lg bg-teal-500 px-4 py-1.5 text-sm text-white shadow transition-colors hover:bg-teal-600"
        >
          {isSaving ? "Creating..." : "Create"}
        </button>
      }
    >
      <div />
    </BaseModal>
  );
}
