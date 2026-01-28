import { toast as sonnerToast } from "sonner";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { cn } from "./general";
import { useNestStore } from "@/stores/useNestStore";

export const toast = {
  success: (message: string) => {
    const activeBackgroundId = useNestStore.getState().activeBackgroundId;

    return sonnerToast.custom((id) => (
      <div
        className={cn(
          "flex w-90 flex-row items-center gap-3 rounded-lg border-l-6 border-green-500 bg-white p-3 shadow-lg dark:bg-gray-800",
          activeBackgroundId && "bg-white/50 backdrop-blur-sm dark:bg-black/50",
        )}
      >
        <div className="flex-shrink-0 rounded-full bg-green-500/10 p-2">
          <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
        </div>
        <p className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
          {message}
        </p>
        <button
          onClick={() => sonnerToast.dismiss(id)}
          className={cn(
            "flex-shrink-0 rounded-full p-1.5 transition",
            "text-gray-500 hover:bg-gray-100 hover:text-gray-600",
            "dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200",
            activeBackgroundId && "hover:bg-white/30 dark:hover:bg-black/30",
          )}
        >
          <X className="size-4" />
        </button>
      </div>
    ));
  },

  error: (message: string) => {
    const activeBackgroundId = useNestStore.getState().activeBackgroundId;

    return sonnerToast.custom((id) => (
      <div
        className={cn(
          "flex w-90 flex-row items-center gap-3 rounded-lg border-l-6 border-red-500 bg-white p-3 shadow-lg dark:bg-gray-800",
          activeBackgroundId && "bg-white/50 backdrop-blur-sm dark:bg-black/50",
        )}
      >
        <div className="flex-shrink-0 rounded-full bg-red-500/10 p-2">
          <XCircle className="size-5 text-red-600 dark:text-red-400" />
        </div>
        <p className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
          {message}
        </p>
        <button
          onClick={() => sonnerToast.dismiss(id)}
          className={cn(
            "flex-shrink-0 rounded-full p-1.5 transition",
            "text-gray-500 hover:bg-gray-100 hover:text-gray-600",
            "dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200",
            activeBackgroundId && "hover:bg-white/30 dark:hover:bg-black/30",
          )}
        >
          <X className="size-4" />
        </button>
      </div>
    ));
  },
};
