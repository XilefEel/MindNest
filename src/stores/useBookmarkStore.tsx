import { Bookmark } from "@/lib/types/bookmark";
import { withStoreErrorHandler } from "@/lib/utils/general";
import { create } from "zustand";
import * as bookmarkApi from "@/lib/api/bookmark";
import { useShallow } from "zustand/react/shallow";
import { updateNestlingTimestamp } from "@/lib/utils/nestlings";

type BookmarkState = {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;

  getBookmarks: (nestlingId: number) => Promise<void>;
  createBookmark: (nestlingId: number, url: string) => Promise<void>;
  toggleBookmarkFavorite: (id: number) => Promise<void>;
  deleteBookmark: (id: number) => Promise<void>;
};

export const useBookmarkStore = create<BookmarkState>()((set, get) => ({
  bookmarks: [],
  loading: false,
  error: null,

  getBookmarks: withStoreErrorHandler(set, async (nestlingId: number) => {
    const bookmarks = await bookmarkApi.getBookmarks(nestlingId);
    set({ bookmarks });
  }),

  createBookmark: withStoreErrorHandler(
    set,
    async (nestlingId: number, url: string) => {
      const bookmark = await bookmarkApi.createBookmark(nestlingId, url);
      set((state) => ({
        bookmarks: [bookmark, ...state.bookmarks],
      }));
      await updateNestlingTimestamp(nestlingId);
    },
  ),

  toggleBookmarkFavorite: withStoreErrorHandler(set, async (id: number) => {
    await bookmarkApi.toggleBookmarkFavorite(id);

    set((state) => ({
      bookmarks: state.bookmarks.map((b) =>
        b.id === id ? { ...b, isFavorite: !b.isFavorite } : b,
      ),
    }));

    await updateNestlingTimestamp(
      get().bookmarks.find((bookmark) => bookmark.id === id)!.nestlingId,
    );
  }),

  deleteBookmark: withStoreErrorHandler(set, async (id: number) => {
    await bookmarkApi.deleteBookmark(id);

    await updateNestlingTimestamp(
      get().bookmarks.find((bookmark) => bookmark.id === id)!.nestlingId,
    );

    set((state) => ({
      bookmarks: state.bookmarks.filter((b) => b.id !== id),
    }));
  }),
}));

export const useBookmarks = () => useBookmarkStore((state) => state.bookmarks);

export const useBookmarkActions = () =>
  useBookmarkStore(
    useShallow((state) => ({
      getBookmarks: state.getBookmarks,
      createBookmark: state.createBookmark,
      toggleBookmarkFavorite: state.toggleBookmarkFavorite,
      deleteBookmark: state.deleteBookmark,
    })),
  );
