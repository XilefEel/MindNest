import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

type ModalStore = {
  isNestlingOpen: boolean;
  nestlingNestId: number | null;
  nestlingFolderId: number | null;
  openNestlingModal: (nestId: number, folderId?: number) => void;
  closeNestlingModal: () => void;

  isFolderOpen: boolean;
  folderParentId: number | null;
  folderNestId: number | null;
  openFolderModal: (nestId: number, parentId?: number) => void;
  closeFolderModal: () => void;

  isDeleteOpen: boolean;
  deleteType: "nestling" | "folder" | null;
  deleteId: number | null;
  setDeleteTarget: (type: "nestling" | "folder", id: number) => void;
  clearDeleteTarget: () => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;

  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  isNestlingOpen: false,
  nestlingNestId: null,
  nestlingFolderId: null,
  openNestlingModal: (nestId, folderId) =>
    set({
      isNestlingOpen: true,
      nestlingNestId: nestId,
      nestlingFolderId: folderId ?? null,
    }),
  closeNestlingModal: () =>
    set({
      isNestlingOpen: false,
      nestlingNestId: null,
      nestlingFolderId: null,
    }),

  isFolderOpen: false,
  folderParentId: null,
  folderNestId: null,
  openFolderModal: (nestId, parentId) =>
    set({
      isFolderOpen: true,
      folderNestId: nestId,
      folderParentId: parentId,
    }),
  closeFolderModal: () =>
    set({
      isFolderOpen: false,
      folderNestId: null,
      folderParentId: null,
    }),

  isDeleteOpen: false,
  deleteType: null,
  deleteId: null,
  setDeleteTarget: (type, id) => {
    set({ deleteType: type, deleteId: id, isDeleteOpen: true });
  },
  clearDeleteTarget: () => {
    set({ deleteType: null, deleteId: null, isDeleteOpen: false });
  },

  isSearchOpen: false,
  setIsSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),

  isSettingsOpen: false,
  setIsSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
}));

export const useNestlingModal = () =>
  useModalStore(
    useShallow((state) => ({
      isNestlingOpen: state.isNestlingOpen,
      nestlingNestId: state.nestlingNestId,
      nestlingFolderId: state.nestlingFolderId,
      openNestlingModal: state.openNestlingModal,
      closeNestlingModal: state.closeNestlingModal,
    })),
  );

export const useFolderModal = () =>
  useModalStore(
    useShallow((state) => ({
      isFolderOpen: state.isFolderOpen,
      folderNestId: state.folderNestId,
      folderParentId: state.folderParentId,
      openFolderModal: state.openFolderModal,
      closeFolderModal: state.closeFolderModal,
    })),
  );

export const useDeleteModal = () =>
  useModalStore(
    useShallow((state) => ({
      isDeleteOpen: state.isDeleteOpen,
      deleteType: state.deleteType,
      deleteId: state.deleteId,
      setDeleteTarget: state.setDeleteTarget,
      clearDeleteTarget: state.clearDeleteTarget,
    })),
  );

export const useSearchModal = () =>
  useModalStore(
    useShallow((state) => ({
      isSearchOpen: state.isSearchOpen,
      setIsSearchOpen: state.setIsSearchOpen,
    })),
  );

export const useSettingsModal = () =>
  useModalStore(
    useShallow((state) => ({
      isSettingsOpen: state.isSettingsOpen,
      setIsSettingsOpen: state.setIsSettingsOpen,
    })),
  );
