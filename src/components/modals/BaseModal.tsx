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
import { Button } from "../ui/button";
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
          "flex flex-col items-stretch justify-start",
          "rounded-2xl border-0 p-6 shadow-xl transition-all ease-in-out",
          "bg-white dark:bg-gray-800",
          isLarge && "min-h-9/12 min-w-3xl",
          activeBackgroundId && "bg-white/50 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <DialogHeader className="justify-between">
          <DialogTitle className="text-xl font-bold text-black dark:text-white">
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-hidden p-1">
          {body}
        </div>

        {(footer || showCancel !== false) && (
          <DialogFooter className="flex justify-between gap-2">
            {showCancel !== false && (
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="cursor-pointer rounded-lg bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Cancel
                </Button>
              </DialogClose>
            )}
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
