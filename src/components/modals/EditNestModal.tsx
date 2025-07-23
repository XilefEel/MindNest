import { updateNest, deleteNest } from "@/lib/nests";
import { Nest } from "@/lib/types";
import { useState } from "react";
import { Button } from "../ui/button";
import { Trash, X } from "lucide-react";

export default function EditNestModal({
  nest,
  refresh,
}: {
  nest: Nest;
  refresh?: () => void;
}) {
  const [title, setTitle] = useState(nest.title);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async () => {
    if (title.trim() == "") return setError("Title is required");
    await updateNest(nest.id, title);
    refresh?.();
  };
  const handleDelete = async () => {
    await deleteNest(nest.id);
    refresh?.();
  };

  return (
    <div
      onClick={refresh}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-4 transition-all"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Edit Nest
          </h2>
          <button
            onClick={refresh}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nest Title
          </p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Personal, Work, School"
            className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={handleDelete}
            className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            <Trash size={14} />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={handleEdit}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
