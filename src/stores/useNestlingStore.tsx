import { create } from "zustand";
import { getNestlings } from "@/lib/api/nestlings";
import { getFolders, updateNestlingFolder } from "@/lib/api/folders";
import { Folder, FolderWithNestlings } from "@/lib/types/folders";
import { Nestling } from "@/lib/types/nestlings";
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";

type NestlingTreeState = {
  // State
  nestId: number | null; // The ID of the current nest
  folders: Folder[]; // Lists of Folders in the current nest
  nestlings: Nestling[]; // Lists of Nestlings in the current nest, regardless of folder
  openFolders: Record<number, boolean>; // Keeps track of which folders are open (true) or closed (false)
  activeNestling: Nestling | null; // The currently selected or opened Nestling
  activeFolderId: number | null;
  activeDraggingNestlingId: number | null; // The ID of the Nestling currently being dragged

  // Actions
  setActiveNestling: (nestling: Nestling | null) => void; // Sets the currently selected or opened Nestling
  setActiveFolderId: (folder: number | null) => void;
  setNestId: (nestId: number) => void; // Sets the ID of the current nest
  setFolderOpen: (folder_ids: number, isOpen: boolean) => void; // Sets the open/closed state of a folder

  // Helpers
  refreshData: () => Promise<void>; // Re-fetches the folders + nestlings from the backend/database
  toggleFolder: (folderId: number) => void; // Expands/collapses a folder in the sidebar
  handleDragStart: (event: DragStartEvent) => void; // Triggered when a drag begins.
  handleDragEnd: (event: DragEndEvent) => Promise<void>; // Triggered when a drag ends.
  folderGroups: () => FolderWithNestlings[]; // Groups folders with their nestlings
  looseNestlings: () => Nestling[]; // Returns all nestlings that are not in a folder
  updateNestling: (id: number, updates: Partial<Nestling>) => void; // Updates a nestling
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
  setNestId: (nestId: number) =>
    set((state) => {
      const isSameNest = state.activeNestling?.nest_id === nestId;

      return {
        nestId,
        activeNestling: isSameNest ? state.activeNestling : null,
      };
    }),

  setActiveNestling: (nestling) => set({ activeNestling: nestling }),
  setFolderOpen: (folderId: number, isOpen: boolean) =>
    set((state) => ({
      openFolders: {
        ...state.openFolders,
        [folderId]: isOpen,
      },
    })),

  setActiveFolderId: (folderId) => set({ activeFolderId: folderId }),

  // Helpers
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
    set({ activeDraggingNestlingId: event.active.id as number });
  },

  handleDragEnd: async (event) => {
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
