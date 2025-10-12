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
import { saveLastNestling } from "@/lib/storage/session";

type NestlingState = {
  nestlings: Nestling[];
  activeNestlingId: number | null;
  folders: Folder[];
  activeFolderId: number | null;

  openFolders: Record<number, boolean>;
  activeDraggingNestlingId: number | null;
  loading: boolean;
  error: string | null;

  setActiveNestlingId: (nestlingId: number | null) => void;
  setActiveFolderId: (folder: number | null) => void;
  setFolderOpen: (folder_ids: number, isOpen: boolean) => void;
  toggleFolder: (folderId: number) => void;
  toggleAllFolders: (toggle: boolean) => void;

  addNestling: (nestling: NewNestling) => Promise<void>;
  duplicateNestling: (nestlingId: number) => Promise<void>;
  updateNestling: (id: number, updates: Partial<Nestling>) => Promise<void>;
  deleteNestling: (nestlingId: number) => Promise<void>;

  addFolder: (folder: NewFolder) => Promise<void>;
  duplicateFolder: (folderId: number) => Promise<void>;
  updateFolder: (id: number, name: string) => Promise<void>;
  deleteFolder: (folderId: number) => Promise<void>;

  fetchSidebar: (nestId: number) => Promise<void>;

  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent, nestId: number) => Promise<void>;
};

export const useNestlingStore = create<NestlingState>((set, get) => ({
  nestlings: [],
  folders: [],
  activeNestlingId: null,
  activeFolderId: null,

  openFolders: {},
  activeDraggingNestlingId: null,
  loading: false,
  error: null,

  setActiveNestlingId: (number) => set({ activeNestlingId: number }),

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
        nestlings: [...state.nestlings, newNestling].sort((a, b) =>
          a.title.localeCompare(b.title),
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: String(error) });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  duplicateNestling: async (nestlingId: number) => {
    set({ loading: true, error: null });
    try {
      const originalNestling = get().nestlings.find(
        (n) => n.id === nestlingId,
      )!;
      const newNestling = await createNestling(originalNestling);

      set((state) => ({
        nestlings: [...state.nestlings, newNestling].sort((a, b) =>
          a.title.localeCompare(b.title),
        ),
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
        nestlings: state.nestlings
          .map((n) =>
            n.id === id
              ? {
                  ...n,
                  folder_id: updates.folder_id ?? n.folder_id,
                  title: updates.title ?? n.title,
                  content: updates.content ?? n.content,
                }
              : n,
          )
          .sort((a, b) => a.title.localeCompare(b.title)),
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

  addFolder: async (folder) => {
    set({ loading: true, error: null });
    try {
      const newFolder = await createFolder(folder);
      set((state) => ({
        folders: [...state.folders, newFolder].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: String(error) });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  duplicateFolder: async (folderId) => {
    set({ loading: true, error: null });
    try {
      const originalFolder = get().folders.find((f) => f.id === folderId)!;
      const newFolder = await createFolder(originalFolder);

      set((state) => ({
        folders: [...state.folders, newFolder].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
        loading: false,
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
      await updateFolder(id, undefined, name);
      set((state) => ({
        folders: state.folders
          .map((f) => (f.id === id ? { ...f, name } : f))
          .sort((a, b) => a.name.localeCompare(b.name)),
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

  fetchSidebar: async (nestId) => {
    try {
      const [fetchedFolders, fetchedNestlings] = await Promise.all([
        getFolders(nestId),
        getNestlings(nestId),
      ]);

      set({
        folders: fetchedFolders.sort((a, b) => a.name.localeCompare(b.name)),
        nestlings: fetchedNestlings.sort((a, b) =>
          a.title.localeCompare(b.title),
        ),
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

  toggleAllFolders: (toggle: boolean) => {
    set((state) => ({
      openFolders: {
        ...state.openFolders,
        ...Object.fromEntries(state.folders.map((f) => [f.id, toggle])),
      },
    }));
  },

  handleDragStart: (event) => {
    console.log("DRAG START", event);
    set({ activeDraggingNestlingId: event.active.id as number });
  },

  handleDragEnd: async (event, nestId) => {
    const { active, over } = event;
    set({ activeDraggingNestlingId: null });
    if (!over || active.id === over.id) return;

    const [activeType, activeIdStr] = String(active.id).split("-");
    const [overType, overIdStr] = String(over.id).split("-");

    try {
      if (activeType === "nestling") {
        const nestlingId = Number(activeIdStr);
        const newFolderId = overType === "folder" ? Number(overIdStr) : null;

        Promise.all([
          editNestling(nestlingId, newFolderId),
          saveLastNestling(nestId, nestlingId),
        ]);

        set((state) => ({
          nestlings: state.nestlings
            .map((n) =>
              n.id === nestlingId ? { ...n, folder_id: newFolderId } : n,
            )
            .sort((a, b) => a.title.localeCompare(b.title)),
          activeNestlingId: nestlingId,
        }));
      } else if (activeType === "folder") {
        const folderId = Number(activeIdStr);
        const newParentId = overType === "folder" ? Number(overIdStr) : null;

        if (folderId === newParentId) return;

        const folderMap = new Map(
          get().folders.map((f) => [f.id, f.parent_id]),
        );

        // Check if the folder is an ancestor of the new parent
        let ancestorId: number | null = newParentId;
        while (ancestorId !== null) {
          if (ancestorId === folderId) return;
          ancestorId = folderMap.get(ancestorId) ?? null;
        }

        await updateFolder(folderId, newParentId);

        set((state) => ({
          folders: state.folders
            .map((f) =>
              f.id === folderId ? { ...f, parent_id: newParentId } : f,
            )
            .sort((a, b) => a.name.localeCompare(b.name)),
        }));
      }
    } catch (err) {
      console.error("Failed to drag folder:", err);
    } finally {
      set({ loading: false });
    }
  },
}));
