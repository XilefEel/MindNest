import { create } from "zustand";
import {
  GalleryImage,
  GalleryAlbum,
  NewGalleryAlbum,
} from "@/lib/types/gallery";
import * as galleryApi from "@/lib/api/gallery";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import { mergeWithCurrent, withStoreErrorHandler } from "@/lib/utils/general";
import { useNestlingStore } from "./useNestlingStore";
import { useShallow } from "zustand/react/shallow";

type GalleryState = {
  images: GalleryImage[];
  albums: GalleryAlbum[];
  activeDraggingImageId: string | null;
  loading: boolean;
  error: string | null;

  getImages: (nestlingId: number) => Promise<void>;
  selectImages: (
    nestlingId: number,
    albumId?: number | null,
  ) => Promise<boolean>;
  uploadImage: ({
    nestlingId,
    file,
    albumId,
  }: {
    nestlingId: number;
    file: {
      path?: string;
      name?: string;
      data?: Uint8Array;
    };
    albumId?: number | null;
  }) => Promise<void>;
  duplicateImage: (id: number) => Promise<GalleryImage>;
  updateImage: (id: number, updates: Partial<GalleryImage>) => Promise<void>;
  removeImage: (id: number) => Promise<void>;
  downloadImage: (id: number) => Promise<void>;

  getAlbums: (nestlingId: number) => Promise<void>;
  addAlbum: ({
    nestlingId,
    name,
    description,
  }: {
    nestlingId: number;
    name: string;
    description: string | null;
  }) => Promise<void>;
  downloadAlbum: (id: number) => Promise<void>;
  updateAlbum: (id: number, updates: Partial<GalleryAlbum>) => Promise<void>;
  deleteAlbum: (id: number) => Promise<void>;

  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
};

export const useGalleryStore = create<GalleryState>((set, get) => ({
  images: [],
  albums: [],
  activeDraggingImageId: null,

  loading: false,
  error: null,

  getImages: withStoreErrorHandler(set, async (nestlingId: number) => {
    const images = await galleryApi.getImages(nestlingId);
    set({ images });
  }),

  selectImages: withStoreErrorHandler(
    set,
    async (nestlingId: number, albumId?: number | null) => {
      const selected = await open({
        multiple: true,
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpeg", "jpg", "gif", "webp", "bmp"],
          },
        ],
      });

      if (!selected) return false;

      const files = Array.isArray(selected) ? selected : [selected];

      for (const filePath of files) {
        await get().uploadImage({
          nestlingId,
          file: { path: filePath },
          albumId: albumId,
        });
      }

      return true;
    },
  ),

  uploadImage: withStoreErrorHandler(
    set,
    async ({
      nestlingId,
      file,
      albumId,
    }: {
      nestlingId: number;
      file: {
        path?: string;
        name?: string;
        data?: Uint8Array;
      };
      albumId?: number | null;
    }) => {
      let newImage: GalleryImage;
      newImage = file.path
        ? await galleryApi.importImage(nestlingId, file.path, albumId)
        : await galleryApi.importImageData(
            nestlingId,
            file.name!,
            Array.from(file.data!),
            albumId,
          );

      set((state) => ({
        images: [...state.images, newImage],
      }));

      useNestlingStore.getState().updateNestlingTimestamp(newImage.nestlingId);
    },
  ),

  duplicateImage: withStoreErrorHandler(set, async (id: number) => {
    const image = await galleryApi.duplicateImage(id);
    set((state) => ({
      images: [...state.images, image],
    }));
    useNestlingStore.getState().updateNestlingTimestamp(image.nestlingId);
    return image;
  }),

  updateImage: withStoreErrorHandler(set, async (id, updates) => {
    const currentImage = get().images.find((img) => img.id === id);
    if (!currentImage) throw new Error("Image not found");

    const updated = mergeWithCurrent(currentImage, updates);

    set((state) => ({
      images: state.images.map((img) => (img.id === id ? updated : img)),
    }));

    await galleryApi.updateImage({ ...updated, id });
    useNestlingStore.getState().updateNestlingTimestamp(updated.nestlingId);
  }),

  removeImage: withStoreErrorHandler(set, async (id: number) => {
    const nestlingId = get().images.find((i) => i.id === id)?.nestlingId;

    await galleryApi.removeImage(id);
    set((state) => ({
      images: state.images.filter((image) => image.id !== id),
    }));

    if (nestlingId) {
      useNestlingStore.getState().updateNestlingTimestamp(nestlingId);
    }
  }),

  downloadImage: withStoreErrorHandler(set, async (id: number) => {
    const filePath = await save({
      title: "Save Image",
      defaultPath: `${"image"}.png`,
      filters: [
        {
          name: "Image Files",
          extensions: ["png", "jpeg", "jpg", "gif", "webp", "bmp"],
        },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (!filePath) throw new Error("Download canceled");
    await galleryApi.downloadImage(id, filePath);
  }),

  getAlbums: withStoreErrorHandler(set, async (nestlingId: number) => {
    const albums = await galleryApi.getAlbums(nestlingId);
    set({ albums });
  }),

  addAlbum: withStoreErrorHandler(set, async (data: NewGalleryAlbum) => {
    const newAlbum = await galleryApi.createAlbum(data);
    set((state) => ({
      albums: [...state.albums, newAlbum],
    }));
    useNestlingStore.getState().updateNestlingTimestamp(newAlbum.nestlingId);
  }),

  downloadAlbum: withStoreErrorHandler(set, async (id: number) => {
    const filePath = await save({
      title: "Save Album",
      defaultPath: `Album_${id}.zip`,
      filters: [{ name: "Zip Files", extensions: ["zip"] }],
    });

    if (!filePath) throw new Error("Download canceled");

    await galleryApi.downloadAlbum(id, filePath);
    set({ loading: false });
  }),

  updateAlbum: withStoreErrorHandler(set, async (id, updates) => {
    const current = get().albums.find((album) => album.id === id);
    if (!current) throw new Error("Album not found");

    const updated = mergeWithCurrent(current, updates);

    await galleryApi.updateAlbum({ ...updated, id });
    set((state) => ({
      albums: state.albums.map((album) => (album.id === id ? updated : album)),
    }));
    useNestlingStore.getState().updateNestlingTimestamp(updated.nestlingId);
  }),

  deleteAlbum: withStoreErrorHandler(set, async (id: number) => {
    const nestlingId = get().albums.find((a) => a.id === id)?.nestlingId;

    await galleryApi.deleteAlbum(id);
    set((state) => ({
      albums: state.albums.filter((album) => album.id !== id),
    }));

    if (nestlingId) {
      useNestlingStore.getState().updateNestlingTimestamp(nestlingId);
    }
  }),

  handleDragStart: (event: DragStartEvent) => {
    set({ activeDraggingImageId: event.active.id as string });
  },

  handleDragEnd: async (event: DragEndEvent) => {
    const { active, over } = event;
    set({ activeDraggingImageId: null });
    if (!over || active.id === over.id) return;

    const activeImage = active.data.current;
    const overAlbum = over.data.current;

    if (activeImage?.type === "image" && overAlbum?.type === "album") {
      const imageId = parseInt(active.id as string, 10);
      const albumId = parseInt(over.id as string, 10);

      try {
        await get().updateImage(imageId, { albumId });
      } catch (error) {
        set({ error: String(error) });
      }
    }
  },
}));

export const useImages = () => useGalleryStore((state) => state.images);
export const useAlbums = () => useGalleryStore((state) => state.albums);

export const useGalleryActions = () =>
  useGalleryStore(
    useShallow((state) => ({
      getImages: state.getImages,
      selectImages: state.selectImages,
      uploadImage: state.uploadImage,
      duplicateImage: state.duplicateImage,
      updateImage: state.updateImage,
      removeImage: state.removeImage,
      downloadImage: state.downloadImage,

      getAlbums: state.getAlbums,
      addAlbum: state.addAlbum,
      downloadAlbum: state.downloadAlbum,
      updateAlbum: state.updateAlbum,
      deleteAlbum: state.deleteAlbum,

      handleDragStart: state.handleDragStart,
      handleDragEnd: state.handleDragEnd,
    })),
  );
