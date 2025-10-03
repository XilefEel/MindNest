import { create } from "zustand";
import { getNestlings } from "@/lib/api/nestlings";
import { getFolders, updateNestlingFolder } from "@/lib/api/folders";
import { Folder } from "@/lib/types/folders";
import { Nestling } from "@/lib/types/nestlings";
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";

type NestlingTreeState = {
  folders: Folder[];
  nestlings: Nestling[];
  openFolders: Record<number, boolean>;
  activeNestling: Nestling | null;
  activeFolderId: number | null;
  activeDraggingNestlingId: number | null;

  setActiveNestling: (nestling: Nestling | null) => void;
  setActiveFolderId: (folder: number | null) => void;
  setFolderOpen: (folder_ids: number, isOpen: boolean) => void;

  fetchSidebar: (nestId: number) => Promise<void>;
  toggleFolder: (folderId: number) => void;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent, nestId: number) => Promise<void>;
  updateNestling: (id: number, updates: Partial<Nestling>) => void;
};

export const useNestlingTreeStore = create<NestlingTreeState>((set, get) => ({
  // State
  nestId: null,
  folders: [],
  nestlings: [],
  openFolders: {},
  activeNestling: null,
  activeFolderId: null,
  activeDraggingNestlingId: null,

  // Actions
  setActiveNestling: (nestling) => set({ activeNestling: nestling }),

  setActiveFolderId: (folderId) => set({ activeFolderId: folderId }),

  setFolderOpen: (folderId: number, isOpen: boolean) =>
    set((state) => ({
      openFolders: {
        ...state.openFolders,
        [folderId]: isOpen,
      },
    })),

  // Helpers
  fetchSidebar: async (nestId) => {
    try {
      const [fetchedFolders, fetchedNestlings] = await Promise.all([
        getFolders(nestId),
        getNestlings(nestId),
      ]);

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
    set({ activeDraggingNestlingId: event.active.id as number });
  },

  handleDragEnd: async (event, nestId) => {
    const { active, over } = event;
    set({ activeDraggingNestlingId: null });

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
      await get().fetchSidebar(nestId);
    }
  },

  updateNestling: (id, updates) => {
    set((state) => ({
      nestlings: state.nestlings.map((n) =>
        n.id === id ? { ...n, ...updates } : n,
      ),
    }));
  },
}));
