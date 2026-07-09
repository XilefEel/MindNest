import { create } from "zustand";
import * as nestlingApi from "@/lib/api/nestling";
import * as folderApi from "@/lib/api/folder";
import * as tagApi from "@/lib/api/tag";
import { Folder, NewFolder } from "@/lib/types/folder";
import { Nestling, NewNestling } from "@/lib/types/nestling";
import { DragEndEvent } from "@dnd-kit/react";
import { mergeWithCurrent, withStoreErrorHandler } from "@/lib/utils/general";
import { useShallow } from "zustand/react/shallow";
import { updateNestlingTimestamp } from "@/lib/utils/nestlings";
import { saveRecentNestling } from "@/lib/storage/nestling";
import { NewTag, Tag } from "@/lib/types/tag";
import { isCircularReference } from "@/lib/utils/folders.ts";

type NestlingState = {
  nestlings: Nestling[];
  activeNestlingId: number | null;

  folders: Folder[];
  folderMap: Map<number, Folder>;
  activeFolderId: number | null;
  openFolders: Record<number, boolean>;

  tags: Tag[];
  nestlingTagsMap: Map<number, Tag[]>;

  activeDraggingNestlingId: number | null;
  loading: boolean;

  setActiveNestlingId: (nestlingId: number | null) => void;
  setActiveFolderId: (folder: number | null) => void;

  addNestling: (nestling: NewNestling) => Promise<Nestling>;
  duplicateNestling: (nestlingId: number) => Promise<void>;
  updateNestling: (id: number, updates: Partial<Nestling>) => Promise<void>;
  updateNestlingTimestamp: (nestlingId: number, timestamp: string) => void;
  deleteNestling: (nestlingId: number) => Promise<void>;

  addFolder: (folder: NewFolder) => Promise<void>;
  duplicateFolder: (folderId: number) => Promise<void>;
  updateFolder: (id: number, updates: Partial<Folder>) => Promise<void>;
  deleteFolder: (folderId: number) => Promise<void>;

  fetchSidebar: (nestId: number) => Promise<void>;

  setFolderOpen: (folderIds: number, isOpen: boolean) => void;
  setSubFolderOpen: (parentId: number, isOpen: boolean) => void;
  toggleFolder: (folderId: number) => void;
  toggleAllFolders: (toggle: boolean) => void;
  moveFolder: (folderId: number, newParentId: number | null) => Promise<void>;

  handleDragEnd: (event: DragEndEvent, nestId: number) => Promise<void>;

  getTags: (nestId: number) => Promise<void>;
  addTag: (data: NewTag) => Promise<Tag>;
  updateTag: (id: number, name: string, color: string) => Promise<void>;
  deleteTag: (id: number) => Promise<void>;

  attachTag: (nestlingId: number, tagId: number) => Promise<void>;
  detachTag: (nestlingId: number, tagId: number) => Promise<void>;
  getAllNestlingTags: (nestId: number) => Promise<void>;
};

export const useNestlingStore = create<NestlingState>((set, get) => ({
  nestlings: [],
  folders: [],
  folderMap: new Map<number, Folder>(),
  loading: false,

  activeNestlingId: null,
  activeFolderId: null,
  openFolders: {},
  activeDraggingNestlingId: null,

  tags: [],
  nestlingTagsMap: new Map<number, Tag[]>(),

  setActiveNestlingId: (nestlingId) => set({ activeNestlingId: nestlingId }),

  setActiveFolderId: (folderId) => set({ activeFolderId: folderId }),

  addNestling: withStoreErrorHandler(set, async (nestling: NewNestling) => {
    const newNestling = await nestlingApi.createNestling(nestling);
    await saveRecentNestling(newNestling.nestId, newNestling.id);

    set((state) => ({
      nestlings: [...state.nestlings, newNestling].sort((a, b) =>
        a.title.localeCompare(b.title),
      ),
    }));

    return newNestling;
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

    set((state) => ({
      nestlings: state.nestlings
        .map((n) => (n.id === id ? updated : n))
        .sort((a, b) => a.title.localeCompare(b.title)),
    }));

    await Promise.all([
      nestlingApi.updateNestling({ ...updated, id }),
      updateNestlingTimestamp(id),
    ]);
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
    set((state) => {
      const folders = [...state.folders, newFolder].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      return {
        folders,
        folderMap: new Map(folders.map((f) => [f.id, f])),
      };
    });
  }),

  duplicateFolder: withStoreErrorHandler(set, async (folderId) => {
    const originalFolder = get().folders.find((f) => f.id === folderId)!;
    const newFolder = await folderApi.createFolder(originalFolder);

    set((state) => {
      const folders = [...state.folders, newFolder].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      return {
        folders,
        folderMap: new Map(folders.map((f) => [f.id, f])),
      };
    });
  }),

  updateFolder: withStoreErrorHandler(set, async (id, updates) => {
    const current = get().folders.find((f) => f.id === id);
    if (!current) throw new Error("Folder not found");

    const updated = {
      ...mergeWithCurrent(current, updates),
      updatedAt: new Date().toISOString(),
    };

    set((state) => {
      const folders = state.folders
        .map((f) => (f.id === id ? updated : f))
        .sort((a, b) => a.name.localeCompare(b.name));

      return {
        folders,
        folderMap: new Map(folders.map((f) => [f.id, f])),
      };
    });

    await folderApi.updateFolder(id, updated.parentId, updated.name);
  }),

  deleteFolder: withStoreErrorHandler(set, async (folderId) => {
    await folderApi.deleteFolder(folderId);

    set((state) => {
      const folders = state.folders.filter((f) => f.id !== folderId);

      return {
        folders,
        folderMap: new Map(folders.map((f) => [f.id, f])),
      };
    });
  }),

  fetchSidebar: withStoreErrorHandler(set, async (nestId) => {
    const [fetchedFolders, fetchedNestlings] = await Promise.all([
      folderApi.getFolders(nestId),
      nestlingApi.getNestlings(nestId),
    ]);

    set({
      nestlings: fetchedNestlings.sort((a, b) =>
        a.title.localeCompare(b.title),
      ),
      folders: fetchedFolders.sort((a, b) => a.name.localeCompare(b.name)),
      folderMap: new Map(fetchedFolders.map((f) => [f.id, f])),
    });
  }),

  setFolderOpen: (folderId: number, isOpen: boolean) =>
    set((state) => ({
      openFolders: {
        ...state.openFolders,
        [folderId]: isOpen,
      },
    })),

  setSubFolderOpen: (parentId: number, isOpen: boolean) => {
    const getDescendantFolderIds = (id: number): number[] => {
      const childFolders = get().folders.filter((f) => f.parentId === id);
      return childFolders.flatMap((f) => [
        f.id,
        ...getDescendantFolderIds(f.id),
      ]);
    };

    const descendantFolderIds = [parentId, ...getDescendantFolderIds(parentId)];

    set((state) => ({
      openFolders: {
        ...state.openFolders,
        ...Object.fromEntries(descendantFolderIds.map((id) => [id, isOpen])),
      },
    }));
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

  moveFolder: withStoreErrorHandler(set, async (folderId, newParentId) => {
    if (isCircularReference(folderId, newParentId, get().folders)) return;
    await get().updateFolder(folderId, { parentId: newParentId });
  }),

  handleDragEnd: async (event) => {
    const { source, target } = event.operation;
    if (event.canceled || !target || !source || source.id === target.id) return;

    const [activeType, activeIdStr] = String(source.id).split("-");
    const [overType, overIdStr] = String(target.id).split("-");

    try {
      if (activeType === "nestling") {
        const nestlingId = Number(activeIdStr);
        const newFolderId = overType === "folder" ? Number(overIdStr) : null;

        if (newFolderId !== null) {
          get().setFolderOpen(newFolderId, true);
        }
        await get().updateNestling(nestlingId, { folderId: newFolderId });
      } else if (activeType === "folder") {
        const folderId = Number(activeIdStr);
        const newParentId = overType === "folder" ? Number(overIdStr) : null;

        if (newParentId !== null) {
          get().setFolderOpen(newParentId, true);
        }
        await get().moveFolder(folderId, newParentId);
      }
    } catch (error) {
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
    set((state) => {
      const nestlingTagsMap = new Map(state.nestlingTagsMap);

      for (const [nestlingId, tags] of nestlingTagsMap) {
        nestlingTagsMap.set(
          nestlingId,
          tags.map((t) => (t.id === id ? { ...t, name, color } : t)),
        );
      }

      return {
        tags: state.tags.map((t) => (t.id === id ? { ...t, name, color } : t)),
        nestlingTagsMap,
      };
    });
  }),

  deleteTag: withStoreErrorHandler(set, async (id) => {
    await tagApi.deleteTag(id);
    set((state) => {
      const nestlingTagsMap = new Map(state.nestlingTagsMap);

      for (const [nestlingId, tags] of nestlingTagsMap) {
        nestlingTagsMap.set(
          nestlingId,
          tags.filter((t) => t.id !== id),
        );
      }

      return {
        tags: state.tags.filter((t) => t.id !== id),
        nestlingTagsMap,
      };
    });
  }),

  attachTag: withStoreErrorHandler(set, async (nestlingId, tagId) => {
    await tagApi.attachTag(nestlingId, tagId);

    set((state) => {
      const tagToAttach = state.tags.find((t) => t.id === tagId);
      if (!tagToAttach) return state;

      const nestlingTagsMap = new Map(state.nestlingTagsMap);
      const currentTags = nestlingTagsMap.get(nestlingId) || [];

      nestlingTagsMap.set(nestlingId, [...currentTags, tagToAttach]);

      return { nestlingTagsMap };
    });
  }),

  detachTag: withStoreErrorHandler(set, async (nestlingId, tagId) => {
    await tagApi.detachTag(nestlingId, tagId);
    set((state) => {
      const nestlingTagsMap = new Map(state.nestlingTagsMap);
      const currentTags = nestlingTagsMap.get(nestlingId) || [];

      nestlingTagsMap.set(
        nestlingId,
        currentTags.filter((t) => t.id !== tagId),
      );

      return { nestlingTagsMap };
    });
  }),

  getAllNestlingTags: withStoreErrorHandler(set, async (nestId) => {
    const rawMap = await tagApi.getAllNestlingTags(nestId);

    const nestlingTagsMap = new Map<number, Tag[]>(
      Object.entries(rawMap).map(([k, v]) => [Number(k), v]),
    );

    set({ nestlingTagsMap });
  }),
}));

export const useNestlingActions = () =>
  useNestlingStore(
    useShallow((state) => ({
      setActiveNestlingId: state.setActiveNestlingId,
      setActiveFolderId: state.setActiveFolderId,

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

      setFolderOpen: state.setFolderOpen,
      setSubFolderOpen: state.setSubFolderOpen,
      toggleFolder: state.toggleFolder,
      toggleAllFolders: state.toggleAllFolders,
      moveFolder: state.moveFolder,

      handleDragEnd: state.handleDragEnd,

      getTags: state.getTags,
      addTag: state.addTag,
      updateTag: state.updateTag,
      deleteTag: state.deleteTag,

      attachTag: state.attachTag,
      detachTag: state.detachTag,
      getAllNestlingTags: state.getAllNestlingTags,
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

export const useFolderMap = () => useNestlingStore((state) => state.folderMap);

export const useActiveFolderId = () =>
  useNestlingStore((state) => state.activeFolderId);

export const useTags = () => useNestlingStore((state) => state.tags);

export const useNestlingTagsMap = () =>
  useNestlingStore((state) => state.nestlingTagsMap);

export const useNestlingTags = (nestlingId: number) =>
  useNestlingStore(
    useShallow((state) => state.nestlingTagsMap.get(nestlingId) ?? []),
  );
