import { toast as sonnerToast } from "sonner";
import { CheckCircle2, FolderOpen, Info, X, XCircle } from "lucide-react";
import { cn, openAppFolder } from "./general";
import { useNestStore } from "@/stores/useNestStore";

type ToastVariant = "success" | "error" | "info";

const variantStyles: Record<
  ToastVariant,
  { border: string; bg: string; icon: React.ReactNode }
> = {
  success: {
    border: "border-green-500",
    bg: "bg-green-500/10",
    icon: (
      <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
    ),
  },
  error: {
    border: "border-red-500",
    bg: "bg-red-500/10",
    icon: <XCircle className="size-5 text-red-600 dark:text-red-400" />,
  },
  info: {
    border: "border-blue-500",
    bg: "bg-blue-500/10",
    icon: <Info className="size-5 text-blue-600 dark:text-blue-400" />,
  },
};

function createToast(
  variant: ToastVariant,
  message: string,
  extraActions?: (
    id: string | number,
    activeBackgroundId: number | null,
  ) => React.ReactNode,
) {
  const activeBackgroundId = useNestStore.getState().activeBackgroundId;
  const { border, bg, icon } = variantStyles[variant];

  return sonnerToast.custom((id) => (
    <div
      className={cn(
        `flex w-90 flex-row items-center gap-2 rounded-lg border-l-6 ${border} bg-white p-3 shadow-lg dark:bg-gray-800`,
        activeBackgroundId && "bg-white/50 backdrop-blur-sm dark:bg-black/50",
      )}
    >
      <div className={cn("flex-shrink-0 rounded-full p-2", bg)}>{icon}</div>

      <p className="flex-1 text-sm font-medium text-gray-900 select-none dark:text-gray-100">
        {message}
      </p>

      {extraActions?.(id, activeBackgroundId)}

      <button
        onClick={() => sonnerToast.dismiss(id)}
        className={cn(
          "rounded-full p-1.5 transition",
          "text-gray-500 hover:bg-gray-100 hover:text-gray-600",
          "dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200",
          activeBackgroundId && "hover:bg-white/30 dark:hover:bg-black/30",
        )}
      >
        <X className="size-4 flex-shrink-0" />
      </button>
    </div>
  ));
}

export const toast = {
  success: (message: string) => createToast("success", message),

  error: (message: string) =>
    createToast(
      "error",
      `${message} See logs for more details.`,
      (id, activeBackgroundId) => (
        <button
          onClick={() => {
            openAppFolder({ location: "local", subfolder: "logs" });
            sonnerToast.dismiss(id);
          }}
          className={cn(
            "rounded-full p-1.5 transition",
            "text-gray-500 hover:bg-gray-100 hover:text-gray-600",
            "dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200",
            activeBackgroundId && "hover:bg-white/30 dark:hover:bg-black/30",
          )}
        >
          <FolderOpen className="size-4 flex-shrink-0" />
        </button>
      ),
    ),

  info: (message: string) => createToast("info", message),
};
