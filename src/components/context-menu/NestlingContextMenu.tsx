import * as ContextMenu from "@radix-ui/react-context-menu";
import { Edit3, Trash2, Copy, Star, Archive } from "lucide-react";
import DeleteModal from "../modals/DeleteModal";

export default function NestlingContextMenu({
  nestlingId,
  children,
}: {
  nestlingId: number;
  children: React.ReactNode;
}) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="animate-in fade-in-0 zoom-in-95 z-50 min-w-[200px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors duration-200 outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={() => console.log("Rename note", nestlingId)}
          >
            <Edit3 className="h-4 w-4" />
            <span>Rename Note</span>
          </ContextMenu.Item>

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors duration-200 outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={() => console.log("Duplicate note", nestlingId)}
          >
            <Copy className="h-4 w-4" />
            <span>Duplicate Note</span>
          </ContextMenu.Item>

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors duration-200 outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={() => console.log("Star note", nestlingId)}
          >
            <Star className="h-4 w-4" />
            <span>Add to Favorites</span>
          </ContextMenu.Item>

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <ContextMenu.Item
            className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors duration-200 outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
            onSelect={() => console.log("Archive note", nestlingId)}
          >
            <Archive className="h-4 w-4" />
            <span>Archive Note</span>
          </ContextMenu.Item>

          <DeleteModal type="nestling" nestlingId={nestlingId}>
            <div
              className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm text-red-600 transition-colors duration-200 outline-none hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              onSelect={() => console.log("Delete folder", nestlingId)}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Nestling</span>
            </div>
          </DeleteModal>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
