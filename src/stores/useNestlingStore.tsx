import { create } from "zustand";
import * as nestlingApi from "@/lib/api/nestling";
import * as folderApi from "@/lib/api/folder";
import * as tagApi from "@/lib/api/tag";
import { Folder, NewFolder } from "@/lib/types/folder";
import { Nestling, NewNestling } from "@/lib/types/nestling";
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { mergeWithCurrent, withStoreErrorHandler } from "@/lib/utils/general";
import { useShallow } from "zustand/react/shallow";
import { updateNestlingTimestamp } from "@/lib/utils/nestlings";
import { saveRecentNestling, saveLastNestling } from "@/lib/storage/nestling";
import { NewTag, Tag } from "@/lib/types/tag";

type NestlingState = {
  nestlings: Nestling[];
  activeNestlingId: number | null;
  folders: Folder[];
  activeFolderId: number | null;
  tags: Tag[];
  selectedNestlingTags: Tag[];

  openFolders: Record<number, boolean>;
  activeDraggingNestlingId: number | null;
  loading: boolean;
  error: string | null;

  setActiveNestlingId: (nestlingId: number | null) => void;
  setActiveFolderId: (folder: number | null) => void;
  setFolderOpen: (folderIds: number, isOpen: boolean) => void;
  toggleFolder: (folderId: number) => void;
  toggleAllFolders: (toggle: boolean) => void;

  addNestling: (nestling: NewNestling) => Promise<void>;
  duplicateNestling: (nestlingId: number) => Promise<void>;
  updateNestling: (id: number, updates: Partial<Nestling>) => Promise<void>;
  updateNestlingTimestamp: (nestlingId: number, timestamp: string) => void;
  deleteNestling: (nestlingId: number) => Promise<void>;

  addFolder: (folder: NewFolder) => Promise<void>;
  duplicateFolder: (folderId: number) => Promise<void>;
  updateFolder: (
    id: number,
    parentId: number | null,
    name: string,
  ) => Promise<void>;
  deleteFolder: (folderId: number) => Promise<void>;

  fetchSidebar: (nestId: number) => Promise<void>;

  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent, nestId: number) => Promise<void>;

  getTags: (nestId: number) => Promise<void>;
  addTag: (data: NewTag) => Promise<Tag>;
  updateTag: (id: number, name: string, color: string) => Promise<void>;
  deleteTag: (id: number) => Promise<void>;

  attachTag: (nestlingId: number, tagId: number) => Promise<void>;
  detachTag: (nestlingId: number, tagId: number) => Promise<void>;
  getNestlingTags: (nestlingId: number) => Promise<void>;
};

export const useNestlingStore = create<NestlingState>((set, get) => ({
  nestlings: [],
  folders: [],
  loading: false,
  error: null,

  activeNestlingId: null,
  activeFolderId: null,
  openFolders: {},
  activeDraggingNestlingId: null,

  tags: [],
  selectedNestlingTags: [],

  setActiveNestlingId: (number) => set({ activeNestlingId: number }),

  setActiveFolderId: (folderId) => set({ activeFolderId: folderId }),

  setFolderOpen: (folderId: number, isOpen: boolean) =>
    set((state) => ({
      openFolders: {
        ...state.openFolders,
        [folderId]: isOpen,
      },
    })),

  addNestling: withStoreErrorHandler(set, async (nestling: NewNestling) => {
    const newNestling = await nestlingApi.createNestling(nestling);
    await saveRecentNestling(newNestling.nestId, newNestling.id);

    set((state) => ({
      nestlings: [...state.nestlings, newNestling].sort((a, b) =>
        a.title.localeCompare(b.title),
      ),
    }));
  }),

  duplicateNestling: withStoreErrorHandler(set, async (nestlingId: number) => {
    const originalNestling = get().nestlings.find((n) => n.id === nestlingId)!;
    const newNestling = await nestlingApi.createNestling(originalNestling);

    set((state) => ({
      nestlings: [...state.nestlings, newNestling].sort((a, b) =>
        a.title.localeCompare(b.title),
      ),
    }));
  }),

  updateNestling: withStoreErrorHandler(set, async (id, updates) => {
    const current = get().nestlings.find((n) => n.id === id);
    if (!current) throw new Error("Nestling not found");

    const updated = {
      ...mergeWithCurrent(current, updates),
      updatedAt: new Date().toISOString(),
    };

    await Promise.all([
      nestlingApi.updateNestling({ ...updated, id }),
      updateNestlingTimestamp(id),
    ]);

    set((state) => ({
      nestlings: state.nestlings
        .map((n) => (n.id === id ? updated : n))
        .sort((a, b) => a.title.localeCompare(b.title)),
    }));
  }),

  updateNestlingTimestamp: withStoreErrorHandler(
    set,
    async (nestlingId: number, timestamp: string) => {
      set((state) => ({
        nestlings: state.nestlings.map((n) =>
          n.id === nestlingId ? { ...n, updatedAt: timestamp } : n,
        ),
      }));
    },
  ),

  deleteNestling: withStoreErrorHandler(set, async (nestlingId) => {
    await nestlingApi.deleteNestling(nestlingId);
    set((state) => ({
      nestlings: state.nestlings.filter((n) => n.id !== nestlingId),
    }));
  }),

  addFolder: withStoreErrorHandler(set, async (folder) => {
    const newFolder = await folderApi.createFolder(folder);
    set((state) => ({
      folders: [...state.folders, newFolder].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    }));
  }),

  duplicateFolder: withStoreErrorHandler(set, async (folderId) => {
    const originalFolder = get().folders.find((f) => f.id === folderId)!;
    const newFolder = await folderApi.createFolder(originalFolder);

    set((state) => ({
      folders: [...state.folders, newFolder].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
      loading: false,
    }));
  }),

  updateFolder: withStoreErrorHandler(set, async (id, parentId, name) => {
    await folderApi.updateFolder(id, parentId, name);
    set((state) => ({
      folders: state.folders
        .map((f) => (f.id === id ? { ...f, name } : f))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }),

  deleteFolder: withStoreErrorHandler(set, async (folderId) => {
    await folderApi.deleteFolder(folderId);
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== folderId),
    }));
  }),

  fetchSidebar: withStoreErrorHandler(set, async (nestId) => {
    const [fetchedFolders, fetchedNestlings] = await Promise.all([
      folderApi.getFolders(nestId),
      nestlingApi.getNestlings(nestId),
    ]);

    set({
      folders: fetchedFolders.sort((a, b) => a.name.localeCompare(b.name)),
      nestlings: fetchedNestlings.sort((a, b) =>
        a.title.localeCompare(b.title),
      ),
    });
  }),

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

        await Promise.all([
          get().updateNestling(nestlingId, { folderId: newFolderId }),
          saveLastNestling(nestId, nestlingId),
        ]);
      } else if (activeType === "folder") {
        const folderId = Number(activeIdStr);
        const newParentId = overType === "folder" ? Number(overIdStr) : null;

        if (folderId === newParentId) return;

        const folderMap = new Map(get().folders.map((f) => [f.id, f.parentId]));

        let ancestorId: number | null = newParentId;
        while (ancestorId !== null) {
          if (ancestorId === folderId) return;
          ancestorId = folderMap.get(ancestorId) ?? null;
        }

        await folderApi.updateFolder(folderId, newParentId);

        set((state) => ({
          folders: state.folders
            .map((f) =>
              f.id === folderId ? { ...f, parentId: newParentId } : f,
            )
            .sort((a, b) => a.name.localeCompare(b.name)),
        }));
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getTags: withStoreErrorHandler(set, async (nestId) => {
    const tags = await tagApi.getTags(nestId);
    set({ tags });
  }),

  addTag: withStoreErrorHandler(set, async (data) => {
    const tag = await tagApi.createTag(data);
    set((state) => ({
      tags: [...state.tags, tag],
    }));
    return tag;
  }),

  updateTag: withStoreErrorHandler(set, async (id, name, color) => {
    await tagApi.updateTag(id, name, color);
    set((state) => ({
      tags: state.tags.map((t) => (t.id === id ? { ...t, name, color } : t)),
      selectedNestlingTags: state.selectedNestlingTags.map((t) =>
        t.id === id ? { ...t, name, color } : t,
      ),
    }));
  }),

  deleteTag: withStoreErrorHandler(set, async (id) => {
    await tagApi.deleteTag(id);
    set((state) => ({
      tags: state.tags.filter((t) => t.id !== id),
      selectedNestlingTags: state.selectedNestlingTags.filter(
        (t) => t.id !== id,
      ),
    }));
  }),

  attachTag: withStoreErrorHandler(set, async (nestlingId, tagId) => {
    await tagApi.attachTag(nestlingId, tagId);
    set((state) => {
      const tag = state.tags.find((t) => t.id === tagId);
      if (tag) {
        return {
          selectedNestlingTags: [...state.selectedNestlingTags, tag],
        };
      }
      return state;
    });
  }),

  detachTag: withStoreErrorHandler(set, async (nestlingId, tagId) => {
    await tagApi.detachTag(nestlingId, tagId);
    set((state) => ({
      selectedNestlingTags: state.selectedNestlingTags.filter(
        (t) => t.id !== tagId,
      ),
    }));
  }),

  getNestlingTags: withStoreErrorHandler(set, async (nestlingId) => {
    const tags = await tagApi.getNestlingTags(nestlingId);
    set({ selectedNestlingTags: tags });
  }),
}));

export const useNestlingActions = () =>
  useNestlingStore(
    useShallow((state) => ({
      setActiveNestlingId: state.setActiveNestlingId,
      setActiveFolderId: state.setActiveFolderId,
      setFolderOpen: state.setFolderOpen,
      toggleFolder: state.toggleFolder,
      toggleAllFolders: state.toggleAllFolders,

      addNestling: state.addNestling,
      duplicateNestling: state.duplicateNestling,
      updateNestling: state.updateNestling,
      updateNestlingTimestamp: state.updateNestlingTimestamp,
      deleteNestling: state.deleteNestling,

      addFolder: state.addFolder,
      duplicateFolder: state.duplicateFolder,
      updateFolder: state.updateFolder,
      deleteFolder: state.deleteFolder,

      fetchSidebar: state.fetchSidebar,
      handleDragStart: state.handleDragStart,
      handleDragEnd: state.handleDragEnd,

      getTags: state.getTags,
      addTag: state.addTag,
      updateTag: state.updateTag,
      deleteTag: state.deleteTag,

      attachTag: state.attachTag,
      detachTag: state.detachTag,
      getNestlingTags: state.getNestlingTags,
    })),
  );

export const useNestlings = () => useNestlingStore((state) => state.nestlings);

export const useActiveNestlingId = () =>
  useNestlingStore((state) => state.activeNestlingId);

export const useActiveNestling = () =>
  useNestlingStore((state) => {
    const { activeNestlingId, nestlings } = state;
    return nestlings.find((n) => n.id === activeNestlingId) ?? null;
  });

export const useFolders = () => useNestlingStore((state) => state.folders);

export const useActiveFolderId = () =>
  useNestlingStore((state) => state.activeFolderId);

export const useTags = () => useNestlingStore((state) => state.tags);

export const useSelectedNestlingTags = () =>
  useNestlingStore((state) => state.selectedNestlingTags);
