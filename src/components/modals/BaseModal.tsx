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
import { useNestStore } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";
import { Button } from "../ui/button";

export default function BaseModal({
  children,
  title,
  description,
  body,
  footer,
  isOpen,
  setIsOpen,
  showCancel = true,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  showCancel?: boolean;
}) {
  const { activeBackgroundId } = useNestStore();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full rounded-2xl border-0 p-6 shadow-xl transition-all ease-in-out",
          "bg-white dark:bg-gray-800",
          activeBackgroundId && "bg-white/30 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <DialogHeader className="justify-between">
          <DialogTitle className="text-xl font-bold text-black dark:text-white">
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">{body}</div>

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
