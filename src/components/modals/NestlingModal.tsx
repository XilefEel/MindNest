import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useNestlingStore } from "@/stores/useNestlingStore";
import BaseModal from "./BaseModal";
import { TextField } from "./TextField";
import { cn } from "@/lib/utils/general";
import { nestlingTypes } from "@/lib/utils/nestlings";
import { useNestStore } from "@/stores/useNestStore";
import { NestlingType } from "@/lib/types/nestling";

export default function NestlingModal({
  children,
  nestId,
  nestlingId,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode;
  nestId?: number;
  nestlingId?: number;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [nestlingType, setNestlingType] = useState<NestlingType>("note");
  const [loading, setLoading] = useState(false);

  const [internalOpen, setInternalOpen] = useState(false);
  const isActuallyOpen = isOpen ?? internalOpen;
  const setOpen = setIsOpen ?? setInternalOpen;

  const { addNestling, activeFolderId, updateNestling, nestlings } =
    useNestlingStore();
  const { activeBackgroundId } = useNestStore();
  const nestling = nestlings.find((n) => n.id === nestlingId);

  const handleExit = async () => {
    setTitle("");
    setNestlingType("note");
    setOpen(false);
  };

  const handleCreateNestling = async () => {
    setLoading(true);
    try {
      const finalTitle =
        title.trim() ||
        `Untitled ${nestlingTypes.find((t) => t.value === nestlingType)?.label}`;

      if (nestlingId) {
        await updateNestling(nestlingId, {
          title: finalTitle,
          folderId: nestling?.folderId,
        });
        toast.success(`Nestling Renamed to "${finalTitle}"!`);
      } else {
        await addNestling({
          nestId: nestId!,
          folderId: activeFolderId,
          title: finalTitle,
          content: "",
          icon: "",
          isPinned: false,
          nestlingType: nestlingType,
        });
        toast.success(`Nestling "${finalTitle}" created successfully!`);
      }
      handleExit();
    } catch (err) {
      console.error("Failed to create nestling:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nestlingId) {
      setTitle(nestling?.title || "");
    }
  }, [nestlingId, nestling]);

  return (
    <BaseModal
      isOpen={isActuallyOpen}
      setIsOpen={setOpen}
      title={nestlingId ? "Rename Nestling" : "Create Nestling"}
      description={
        nestlingId
          ? "Don't like the title? You can change it here."
          : "Give your nestling a title. You can always change it later."
      }
      body={
        <div className="space-y-6">
          <TextField
            label={nestlingId ? "New Title" : "Nestling Title"}
            text={title}
            setText={setTitle}
            placeholder={`e.g. My ${nestlingTypes.find((t) => t.value === nestlingType)?.label || "Note"}`}
          />

          {!nestlingId && (
            <div className="space-y-3">
              <p className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Choose Nestling Type
              </p>
              <div className="grid grid-cols-2 gap-3">
                {nestlingTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = nestlingType === type.value;

                  return (
                    <button
                      key={type.value}
                      onClick={() => setNestlingType(type.value)}
                      className={cn(
                        "relative flex items-center gap-3 rounded-lg p-4 transition-all duration-200",
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
                            ? type.color
                            : "bg-gray-100 dark:bg-gray-700",
                          "text-white",
                        )}
                      >
                        <Icon
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
                          {type.label}
                        </p>
                      </div>
                      {isSelected && (
                        <div
                          className={cn(
                            "absolute top-2 right-2 size-2 rounded-full",
                            type.color,
                          )}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      }
      footer={
        <Button
          onClick={handleCreateNestling}
          disabled={loading || !title.trim()}
          className="cursor-pointer rounded-lg bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
        >
          {nestlingId
            ? loading
              ? "Saving..."
              : "Save"
            : loading
              ? "Creating..."
              : "Create"}
        </Button>
      }
    >
      {children}
    </BaseModal>
  );
}
