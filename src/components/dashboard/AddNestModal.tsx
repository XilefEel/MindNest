import { useState } from "react";
import { createNest } from "@/lib/nests";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";

export default function AddNestModal({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleCreateNest = async () => {
    if (!title.trim()) return alert("Please enter a title");

    const userId = user?.id;
    if (!userId) return alert("User not logged in");

    setLoading(true);
    try {
      await createNest(userId, title.trim());
      onSuccess?.();
      alert("Nest created!");
      setIsOpen(false);
      setTitle("");
    } catch (err) {
      console.error(err);
      alert("Failed to create nest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition"
      >
        <Plus /> New Nest
      </Button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6 transition-all"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-black dark:text-white">
                Create a New Nest
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 hover:bg-gray-300 text-black dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNest}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
