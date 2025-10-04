import { create } from "zustand";
import {
  createNestling,
  getNestlings,
  deleteNestling,
  editNestling,
} from "@/lib/api/nestlings";
import {
  createFolder,
  deleteFolder,
  getFolders,
  updateFolder,
} from "@/lib/api/folders";
import { Folder, NewFolder } from "@/lib/types/folders";
import { Nestling, NewNestling } from "@/lib/types/nestlings";
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";

type NestlingState = {
  nestlings: Nestling[];
  activeNestling: Nestling | null;
  folders: Folder[];
  activeFolderId: number | null;

  openFolders: Record<number, boolean>;
  activeDraggingNestlingId: number | null;
  loading: boolean;
  error: string | null;

  setActiveNestling: (nestling: Nestling | null) => void;
  setActiveFolderId: (folder: number | null) => void;
  setFolderOpen: (folder_ids: number, isOpen: boolean) => void;
  toggleFolder: (folderId: number) => void;

  addNestling: (nestling: NewNestling) => Promise<void>;
  updateNestling: (id: number, updates: Partial<Nestling>) => void;
  deleteNestling: (nestlingId: number) => Promise<void>;

  addFolder: (folder: NewFolder) => Promise<void>;
  updateFolder: (id: number, name: string) => Promise<void>;
  deleteFolder: (folderId: number) => Promise<void>;

  fetchSidebar: (nestId: number) => Promise<void>;

  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent, nestId: number) => Promise<void>;
};

export const useNestlingStore = create<NestlingState>((set, get) => ({
  nestlings: [],
  folders: [],
  activeNestling: null,
  activeFolderId: null,

  openFolders: {},
  activeDraggingNestlingId: null,
  loading: false,
  error: null,

  setActiveNestling: (nestling) => set({ activeNestling: nestling }),

  setActiveFolderId: (folderId) => set({ activeFolderId: folderId }),

  setFolderOpen: (folderId: number, isOpen: boolean) =>
    set((state) => ({
      openFolders: {
        ...state.openFolders,
        [folderId]: isOpen,
      },
    })),

  addNestling: async (nestling: NewNestling) => {
    set({ loading: true, error: null });
    try {
      const newNestling = await createNestling(nestling);
      set((state) => ({
        nestlings: [...state.nestlings, newNestling],
        loading: false,
      }));
    } catch (error) {
      set({ error: String(error) });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addFolder: async (folder) => {
    set({ loading: true, error: null });
    try {
      const newFolder = await createFolder(folder);
      set((state) => ({
        folders: [...state.folders, newFolder],
        loading: false,
      }));
    } catch (error) {
      set({ error: String(error) });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateNestling: async (id, updates) => {
    try {
      await editNestling(
        id,
        updates.folder_id ?? null,
        updates.title,
        updates.content,
      );

      set((state) => ({
        nestlings: state.nestlings.map((n) =>
          n.id === id
            ? {
                ...n,
                folder_id: updates.folder_id ?? n.folder_id,
                title: updates.title ?? n.title,
                content: updates.content ?? n.content,
              }
            : n,
        ),
      }));
    } catch (error) {
      set({ error: String(error) });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateFolder: async (id, name) => {
    try {
      await updateFolder(id, name);
      set((state) => ({
        folders: state.folders.map((f) => (f.id === id ? { ...f, name } : f)),
      }));
    } catch (error) {
      set({ error: String(error) });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteNestling: async (nestlingId) => {
    set({ loading: true, error: null });
    try {
      await deleteNestling(nestlingId);
      set((state) => ({
        nestlings: state.nestlings.filter((n) => n.id !== nestlingId),
      }));
    } catch (error) {
      set({ error: String(error) });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteFolder: async (folderId) => {
    set({ loading: true, error: null });
    try {
      await deleteFolder(folderId);
      set((state) => ({
        folders: state.folders.filter((f) => f.id !== folderId),
      }));
    } catch (error) {
      set({ error: String(error) });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

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
      set({ error: String(err) });
      console.error("Failed to refresh data:", err);
    } finally {
      set({ loading: false });
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
        await editNestling(nestlingId, folderId);
      } else if (overType === "loose") {
        await editNestling(nestlingId, null);
      }
    } catch (err) {
      console.error("Failed to update folder:", err);
    } finally {
      set({ loading: false });
      await get().fetchSidebar(nestId);
    }
  },
}));
