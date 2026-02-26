import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useActiveBackgroundId } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";
import { useEffect } from "react";

export default function BaseModal({
  children,
  setIsOpen,
  title,
  description,
  body,
  footer,
  isOpen,
  showCancel = true,
  isLarge = false,
  onSubmit,
}: {
  children: React.ReactNode;
  setIsOpen: (isOpen: boolean) => void;
  title?: string;
  description?: string;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  isOpen: boolean;
  showCancel?: boolean;
  isLarge?: boolean;
  onSubmit?: () => void;
}) {
  const activeBackgroundId = useActiveBackgroundId();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isOpen && onSubmit) {
        e.preventDefault();
        onSubmit();
      }
    };
    if (isOpen && onSubmit) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onSubmit]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        className={cn(
          "flex flex-col rounded-2xl border-0 bg-white p-6 select-none dark:bg-gray-800",
          isLarge && "min-w-3xl",
          activeBackgroundId && "bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-hidden p-1">
          {body}
        </div>

        {(footer || showCancel) && (
          <DialogFooter className="flex justify-between gap-2">
            {showCancel && (
              <DialogClose asChild>
                <button className="rounded-lg bg-gray-200 px-4 py-1.5 text-sm text-gray-900 shadow transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600">
                  Cancel
                </button>
              </DialogClose>
            )}
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
