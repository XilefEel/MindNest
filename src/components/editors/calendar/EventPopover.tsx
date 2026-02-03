import { PlannerEventType } from "@/lib/types/calendar";
import { usePlannerActions } from "@/stores/usePlannerStore";
import { useState } from "react";
import { Clock, Calendar, Timer, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "@/lib/utils/toast";

export default function EventPopover({
  event,
  onClose,
}: {
  event: PlannerEventType;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || "");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const { updateEvent } = usePlannerActions();

  const handleSaveTitle = () => {
    if (!title.trim()) {
      setTitle(event.title);
      setIsEditingTitle(false);
      return;
    }

    const newTitle = title.trim();

    try {
      updateEvent(event.id, { title: newTitle });
      setIsEditingTitle(false);
    } catch (error) {
      console.error("Failed to update event:", error);
      toast.error("Failed to update event title.");
      setTitle(event.title);
    }
  };

  const handleSaveDescription = () => {
    const newDescription = description.trim();
    try {
      updateEvent(event.id, { description: newDescription });
      setIsEditingDescription(false);
    } catch (error) {
      console.error("Failed to update event:", error);
      toast.error("Failed to update event description.");
      setDescription(event.description || "");
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setTitle(event.title);
      setIsEditingTitle(false);
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setDescription(event.description || "");
      setIsEditingDescription(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 pr-8">
      <div className="flex flex-col">
        <div className="min-w-0 flex-1">
          {isEditingTitle ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={handleSaveTitle}
              autoFocus
              className="mb-1 w-full rounded border border-teal-500 px-2 py-1 text-lg font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="Event title"
            />
          ) : (
            <h3
              onClick={() => setIsEditingTitle(true)}
              className="cursor-pointer truncate rounded px-2 py-1 text-lg font-semibold transition-colors hover:bg-gray-50 hover:text-teal-500 dark:hover:bg-gray-700 dark:hover:text-teal-400"
            >
              {title}
            </h3>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {isEditingDescription ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleDescriptionKeyDown}
              onBlur={handleSaveDescription}
              autoFocus
              rows={6}
              className="mt-1 w-full resize-none rounded border border-teal-500 px-2 py-1 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="Add description..."
            />
          ) : (
            <p
              onClick={() => setIsEditingDescription(true)}
              className="line-clamp-3 cursor-pointer rounded px-2 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-teal-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-teal-400"
            >
              {description || (
                <span className="text-gray-400 italic">Add description...</span>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm tracking-wide">
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
          <Calendar size={16} className="text-gray-400" />
          <span>{format(parseISO(event.date), "EEE, MMM d yyyy")}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
          <Clock size={16} className="text-gray-400" />
          <span>{event.startTime}:00</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
          <Timer size={16} className="text-gray-400" />
          <span>
            {event.duration} {event.duration === 1 ? "hr" : "hrs"}
          </span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
      >
        <X size={18} />
      </button>
    </div>
  );
}
