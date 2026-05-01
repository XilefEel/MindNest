import { useState } from "react";
import { toast } from "@/lib/utils/toast";
import {
  useActiveFolderId,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";
import { cn } from "@/lib/utils/general";
import { nestlingTypeConfigs, openNestling } from "@/lib/utils/nestlings";
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

  const activeFolderId = useActiveFolderId();
  const { addNestling } = useNestlingActions();
  const activeBackgroundId = useActiveBackgroundId();

  const [title, setTitle] = useState("");
  const [nestlingType, setNestlingType] = useState<NestlingType>("note");
  const [isCreating, setIsCreating] = useState(false);

  const effectiveFolderId = nestlingFolderId ?? activeFolderId;

  const handleClose = async () => {
    setTitle("");
    setNestlingType("note");
    closeNestlingModal();
  };

  const handleCreateNestling = async () => {
    if (!nestlingNestId || !title.trim()) return;
    setIsCreating(true);

    try {
      const newNestling = await addNestling({
        nestId: nestlingNestId,
        folderId: effectiveFolderId,
        title: title,
        content: "",
        icon: "",
        isPinned: false,
        nestlingType: nestlingType,
      });
      toast.success(`Nestling "${title}" created successfully!`);

      openNestling(newNestling);
      handleClose();
    } catch (error) {
      toast.error("Failed to create nestling.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <BaseModal
      isOpen={isNestlingOpen}
      setIsOpen={(open) => !open && closeNestlingModal()}
      onSubmit={handleCreateNestling}
      title="Create Nestling"
      description="Give your nestling a title. You can always change it later."
      body={
        <div className="flex flex-col gap-6">
          <TextField
            label="Nestling title"
            text={title}
            setText={setTitle}
            placeholder={`e.g. My ${nestlingTypeConfigs.find((type) => type.value === nestlingType)?.label || "Note"}`}
          />

          <div className="flex flex-col gap-3">
            <p className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Choose nestling type
            </p>
            <div className="grid grid-cols-2 gap-3">
              {nestlingTypeConfigs.map((typeOption) => {
                const Icon = typeOption.icon;
                const isSelected = nestlingType === typeOption.value;

                return (
                  <button
                    key={typeOption.value}
                    onClick={() => setNestlingType(typeOption.value)}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl p-4 transition-colors",
                      isSelected
                        ? activeBackgroundId
                          ? "bg-teal-100/50 shadow-sm dark:bg-teal-500/20"
                          : "border border-teal-300 bg-teal-50 shadow-sm dark:border-teal-500 dark:bg-teal-950/30"
                        : activeBackgroundId
                          ? "bg-white/30 hover:bg-black/5 hover:shadow-sm dark:bg-black/30 dark:hover:bg-white/5"
                          : "border border-gray-200 hover:border-gray-300 hover:shadow-sm dark:border-zinc-700 dark:hover:border-zinc-500",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-lg transition-colors duration-100",
                        isSelected
                          ? typeOption.color
                          : activeBackgroundId
                            ? "bg-white/50 dark:bg-black/50"
                            : "bg-gray-100 dark:bg-zinc-700",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-5 flex-shrink-0 text-white",
                          !isSelected && "text-gray-700 dark:text-zinc-300",
                        )}
                      />
                    </div>

                    <p
                      className={cn(
                        "flex-1 text-left text-sm text-gray-800 dark:text-zinc-300",
                        isSelected &&
                          "font-medium text-teal-700 dark:text-teal-300",
                      )}
                    >
                      {typeOption.label}
                    </p>

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
          onClick={handleCreateNestling}
          disabled={isCreating || !title.trim()}
          className="rounded-lg bg-teal-500 px-4 py-1.5 text-sm text-white shadow hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 disabled:dark:bg-teal-500"
        >
          {isCreating ? "Creating..." : "Create"}
        </button>
      }
    >
      <div />
    </BaseModal>
  );
}
