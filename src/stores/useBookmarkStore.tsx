import { Bookmark } from "@/lib/types/bookmark";
import { withStoreErrorHandler } from "@/lib/utils/general";
import { create } from "zustand";
import * as bookmarkApi from "@/lib/api/bookmark";
import { useShallow } from "zustand/react/shallow";

type BookmarkState = {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;

  getBookmarks: (nestlingId: number) => Promise<void>;
  createBookmark: (nestlingId: number, url: string) => Promise<void>;
  deleteBookmark: (id: number) => Promise<void>;
};

export const useBookmarkStore = create<BookmarkState>()((set) => ({
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
    },
  ),

  deleteBookmark: withStoreErrorHandler(set, async (id: number) => {
    await bookmarkApi.deleteBookmark(id);
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
      deleteBookmark: state.deleteBookmark,
    })),
  );
