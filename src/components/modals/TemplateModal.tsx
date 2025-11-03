import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useJournalStore } from "@/stores/useJournalStore";
import { JournalTemplate } from "@/lib/types/journal";
import { useNestStore } from "@/stores/useNestStore";
import { cn } from "@/lib/utils/general";
import useActiveNestling from "@/hooks/useActiveNestling";

export default function AddTemplateModal({
  children,
  isOpen,
  setIsOpen,
  template,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  template?: JournalTemplate | null;
}) {
  const { activeNestling } = useActiveNestling();
  const { activeBackgroundId } = useNestStore();

  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");

  const { addTemplate, updateTemplate } = useJournalStore();

  const handleSave = () => {
    try {
      if (template) {
        updateTemplate(template.id, {
          name: currentTitle,
          content: currentContent,
        });
        setIsOpen(false);
      } else {
        addTemplate({
          nestlingId: activeNestling.id,
          name: currentTitle,
          content: currentContent,
        });
      }
      setCurrentTitle("");
      setCurrentContent("");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isOpen && template) {
      setCurrentTitle(template.name || "");
      setCurrentContent(template.content || "");
    } else if (isOpen && !template) {
      setCurrentTitle("");
      setCurrentContent("");
    }
  }, [template, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn(
          "max-w-4xl rounded-2xl border-0 bg-white shadow-xl transition-all ease-in-out dark:bg-gray-800",
          activeBackgroundId && "bg-white/50 backdrop-blur-sm dark:bg-black/30",
        )}
      >
        <div className="flex h-full flex-col rounded-xl">
          <DialogHeader
            className={cn(
              "border-b border-slate-100 dark:border-gray-700",
              activeBackgroundId && "border-black/50 dark:border-white/50",
            )}
          >
            <div className="mb-3 flex items-center justify-between text-sm text-slate-500 dark:text-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <DialogTitle asChild>
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                placeholder="Give your template a title..."
                className="w-full border-none bg-transparent py-3 text-2xl font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </DialogTitle>
          </DialogHeader>

          <div className="min-h-[400px] flex-1 py-3">
            <textarea
              value={currentContent}
              onChange={(e) => setCurrentContent(e.target.value)}
              placeholder="Create your template content here..."
              className="h-full w-full resize-none border-none bg-transparent text-base leading-relaxed text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-gray-300 dark:placeholder:text-gray-500"
            />
          </div>

          <div
            className={cn(
              "border-t border-slate-100 py-3 dark:border-gray-700",
              activeBackgroundId && "border-black/50 dark:border-white/50",
            )}
          >
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-gray-300 bg-white text-gray-700 transition duration-200 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!currentTitle.trim()}
                className="bg-teal-500 text-white transition duration-200 hover:bg-teal-600 disabled:opacity-50 dark:bg-teal-600 dark:hover:bg-teal-700"
              >
                {template ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
