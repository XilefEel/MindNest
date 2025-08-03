import { create } from "zustand";
import {
  getFolders,
  getNestlings,
  updateNestlingFolder,
} from "@/lib/nestlings";
import { Folder, Nestling, FolderWithNestlings } from "@/lib/types";
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";

type NestlingTreeState = {
  nestId: number | null;
  folders: Folder[];
  nestlings: Nestling[];
  openFolders: Record<number, boolean>;
  activeId: number | null;
  setNestId: (nestId: number) => void;
  refreshData: () => Promise<void>;
  toggleFolder: (folderId: number) => void;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
  folderGroups: () => FolderWithNestlings[];
  looseNestlings: () => Nestling[];
  updateNestling: (id: number, updates: Partial<Nestling>) => void;
};

export const useNestlingTreeStore = create<NestlingTreeState>((set, get) => ({
  nestId: null,
  folders: [],
  nestlings: [],
  openFolders: {},
  activeId: null,

  setNestId: (id: number) => set({ nestId: id }),

  refreshData: async () => {
    const { nestId } = get();
    if (!nestId) return;

    try {
      const fetchedFolders = (await getFolders(nestId)) as Folder[];
      const fetchedNestlings = (await getNestlings(nestId)) as Nestling[];

      const sortedFolders = [...fetchedFolders].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      const sortedNestlings = [...fetchedNestlings].sort((a, b) =>
        a.title.localeCompare(b.title),
      );

      set({
        folders: sortedFolders,
        nestlings: sortedNestlings,
      });
    } catch (err) {
      console.error("Failed to refresh data:", err);
    }
  },

  toggleFolder: (folderId) => {
    set((state) => ({
      openFolders: {
        ...state.openFolders,
        [folderId]: !state.openFolders[folderId],
      },
    }));
  },

  handleDragStart: (event) => {
    set({ activeId: event.active.id as number });
  },

  handleDragEnd: async (event) => {
    const { active, over } = event;
    set({ activeId: null });

    if (!over || active.id === over.id) return;

    const [activeType, activeIdStr] = String(active.id).split("-");
    const [overType, overIdStr] = String(over.id).split("-");

    if (activeType !== "nestling") return;
    const nestlingId = Number(activeIdStr);

    try {
      if (overType === "folder") {
        const folderId = Number(overIdStr);
        await updateNestlingFolder(nestlingId, folderId);
      } else if (overType === "loose") {
        await updateNestlingFolder(nestlingId, null);
      }
    } catch (err) {
      console.error("Failed to update folder:", err);
    } finally {
      await get().refreshData();
    }
  },

  folderGroups: () => {
    const { folders, nestlings } = get();
    return folders.map((folder) => ({
      ...folder,
      nestlings: nestlings.filter((n) => n.folder_id === folder.id),
    }));
  },

  looseNestlings: () => {
    return get().nestlings.filter((n) => n.folder_id === null);
  },

  updateNestling: (id, updates) => {
    set((state) => ({
      nestlings: state.nestlings.map((n) =>
        n.id === id ? { ...n, ...updates } : n,
      ),
    }));
  },
}));
