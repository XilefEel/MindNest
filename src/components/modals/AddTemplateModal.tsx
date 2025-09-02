import { Calendar } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useJournalStore } from "@/stores/useJournalStore";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";

export default function AddTemplateModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeNestling } = useNestlingTreeStore();
  if (!activeNestling) return null;

  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { addTemplate } = useJournalStore();

  const handleSave = () => {
    try {
      addTemplate({
        nestling_id: activeNestling.id,
        name: currentTitle,
        content: currentContent,
      });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl border-0 bg-white">
        <div className="flex h-full flex-col rounded-xl">
          {/* Entry Header */}
          <DialogHeader className="border-b border-slate-100">
            <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
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
                className="w-full border-none bg-transparent py-3 text-2xl font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </DialogTitle>
          </DialogHeader>

          {/* Text Area */}
          <div className="min-h-[400px] flex-1 py-3">
            <textarea
              value={currentContent}
              onChange={(e) => setCurrentContent(e.target.value)}
              placeholder="Create your template content here..."
              className="h-full w-full resize-none border-none bg-transparent text-base leading-relaxed text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Footer with buttons */}
          <div className="border-t border-slate-100 py-3">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="transition duration-200 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!currentTitle.trim()}
                className="bg-teal-500 transition duration-200 hover:bg-teal-600"
              >
                Save Template
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
