import { Button } from "@/components/ui/button";
import { useMemo } from "react";

const emptyMessages = [
  {
    title: "This Nest is currently empty.",
    subtitle: "Start building your ideas by creating your first Nestling.",
  },
  {
    title: "Nothing here yet.",
    subtitle: "Create your first Nestling to get started.",
  },
  {
    title: "A quiet Nest...",
    subtitle: "Waiting for its first Nestling...",
  },
  {
    title: "Let your ideas hatch",
    subtitle: "Create your first Nestling.",
  },
  {
    title: "This space is empty...",
    subtitle: "But full of potential.",
  },
  {
    title: "Begin your journey.",
    subtitle: "Add something meaningful to your Nest.",
  },
  {
    title: "Where do ideas begin?",
    subtitle: "Right here. Add your first Nestling to get started.",
  },
  {
    title: "No Nestlings here...",
    subtitle: "Every big idea starts with one small note.",
  },
  {
    title: "Clean slate, fresh start",
    subtitle: "You've got a blank canvas. Add something meaningful.",
  },
];

export default function EmptyState() {
  const message = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * emptyMessages.length);
    return emptyMessages[randomIndex];
  }, []);
  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-md space-y-3 text-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {message.title}
          </h2>
          <p className="text-muted-foreground text-sm">{message.subtitle}</p>
        </div>

        <Button>+ Create Nestling</Button>
      </div>
    </div>
  );
}
