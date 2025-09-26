import { create } from "zustand";
import {
  GalleryImage,
  GalleryAlbum,
  NewGalleryAlbum,
  NewGalleryImage,
} from "@/lib/types";
import {
  importImage,
  getImages,
  downloadImage,
  updateImage,
  deleteImage,
  createAlbum,
  getAlbums,
  downloadAlbum,
  updateAlbum,
  deleteAlbum,
  importImageData,
  addImage,
  duplicateImage,
} from "@/lib/nestlings";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { open, save } from "@tauri-apps/plugin-dialog";

type GalleryState = {
  images: GalleryImage[];
  albums: GalleryAlbum[];
  activeDraggingImageId: string | null;
  loading: boolean;
  error: string | null;

  fetchImages: (nestlingId: number) => Promise<void>;
  addImage: (data: NewGalleryImage) => Promise<GalleryImage>;
  duplicateImage: (id: number) => Promise<GalleryImage>;
  uploadImage: (
    nestlingId: number,
    file: {
      path?: string;
      name?: string;
      data?: Uint8Array;
    },
    album_id?: number | null,
  ) => Promise<void>;
  downloadImage: (id: number) => Promise<void>;
  selectImages: (
    nestlingId: number,
    albumId?: number | null,
  ) => Promise<boolean>;
  editImage: ({
    id,
    albumId,
    title,
    description,
    is_favorite,
  }: {
    id: number;
    albumId: number | null;
    title: string | null;
    description: string | null;
    is_favorite: boolean;
  }) => Promise<void>;
  removeImage: (id: number) => Promise<void>;

  fetchAlbums: (nestlingId: number) => Promise<void>;
  addAlbum: ({
    nestling_id,
    name,
    description,
  }: {
    nestling_id: number;
    name: string;
    description: string | null;
  }) => Promise<void>;
  downloadAlbum: (id: number) => Promise<void>;
  editAlbum: ({
    id,
    name,
    description,
  }: {
    id: number;
    name: string | null;
    description: string | null;
  }) => Promise<void>;
  removeAlbum: (id: number) => Promise<void>;

  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
};

export const useGalleryStore = create<GalleryState>((set, get) => ({
  images: [],
  activeDraggingImageId: null,
  albums: [],
  loading: false,
  error: null,

  fetchImages: async (nestlingId: number) => {
    set({ loading: true, error: null });
    try {
      const images = await getImages(nestlingId);
      console.log("Images fetched:", images);
      set({ images, loading: false });
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },

  selectImages: async (nestlingId: number, albumId?: number | null) => {
    try {
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
        await get().uploadImage(nestlingId, { path: filePath }, albumId);
      }
      await get().fetchImages(nestlingId);

      return true;
    } catch (error) {
      console.error("Failed to select files:", error);
      set({ error: String(error) });
      return false;
    }
  },

  addImage: async (data: NewGalleryImage) => {
    set({ loading: true, error: null });
    try {
      const image = await addImage(data);
      set((state) => ({
        images: [...state.images, image],
        loading: false,
      }));
      return image;
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },

  duplicateImage: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const image = await duplicateImage(id);
      set((state) => ({
        images: [...state.images, image],
        loading: false,
      }));
      return image;
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },

  uploadImage: async (
    nestlingId: number,
    file: {
      path?: string;
      name?: string;
      data?: Uint8Array;
    },
    album_id?: number | null,
  ) => {
    set({ loading: true, error: null });
    try {
      let newImage;
      if (file.path) {
        newImage = await importImage(nestlingId, file.path, album_id);
      } else {
        newImage = await importImageData(
          nestlingId,
          file.name!,
          Array.from(file.data!),
          album_id,
        );
      }
      set((state) => ({
        images: [...state.images, newImage],
        loading: false,
      }));
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },

  downloadImage: async (id: number) => {
    set({ loading: true, error: null });
    try {
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

      if (!filePath) {
        set({ loading: false });
        throw new Error("Download canceled");
      }

      await downloadImage(id, filePath);
      set({ loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },

  editImage: async ({
    id,
    albumId,
    title,
    description,
    is_favorite,
  }: {
    id: number;
    albumId: number | null;
    title: string | null;
    description: string | null;
    is_favorite: boolean;
  }) => {
    set({ loading: true, error: null });
    try {
      set((state) => ({
        images: state.images.map((img) =>
          img.id === id
            ? {
                ...img,
                album_id: albumId,
                title,
                description,
                is_favorite,
                updated_at: new Date().toISOString(),
              }
            : img,
        ),
      }));
      await updateImage(id, albumId, title, description, is_favorite);

      set({ loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },

  removeImage: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await deleteImage(id);
      set((state) => ({
        images: state.images.filter((image) => image.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },

  fetchAlbums: async (nestlingId: number) => {
    set({ loading: true, error: null });
    try {
      const albums = await getAlbums(nestlingId);
      console.log("Albums fetched:", albums);
      set({ albums, loading: false });
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },

  addAlbum: async (data: NewGalleryAlbum) => {
    set({ loading: true, error: null });
    try {
      const newAlbum = await createAlbum(data);
      set((state) => ({
        albums: [...state.albums, newAlbum],
        loading: false,
      }));
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },

  downloadAlbum: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const filePath = await save({
        title: "Save Album",
        defaultPath: `Album_${id}.zip`,
        filters: [{ name: "Zip Files", extensions: ["zip"] }],
      });

      if (!filePath) {
        set({ loading: false });
        throw new Error("Download canceled");
      }

      await downloadAlbum(id, filePath);
      set({ loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },

  editAlbum: async ({
    id,
    name,
    description,
  }: {
    id: number;
    name: string | null;
    description: string | null;
  }) => {
    set({ loading: true, error: null });
    try {
      await updateAlbum(id, name, description);
      set((state) => ({
        albums: state.albums.map((album) =>
          album.id === id
            ? {
                ...album,
                name: name ?? album.name,
                description: description ?? album.description,
                updated_at: new Date().toISOString(),
              }
            : album,
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },

  removeAlbum: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await deleteAlbum(id);
      set((state) => ({
        albums: state.albums.filter((album) => album.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },

  handleDragStart: (event: DragStartEvent) => {
    set({ activeDraggingImageId: event.active.id as string });
    console.log("DRAG START");
  },
  handleDragEnd: async (event: DragEndEvent) => {
    const { active, over } = event;
    set({ activeDraggingImageId: null });
    if (!over || active.id === over.id) return;

    const activeImage = active.data.current;
    const overAlbum = over.data.current;

    // Handle dropping an image onto an album
    if (activeImage?.type === "image" && overAlbum?.type === "album") {
      const imageId = parseInt(active.id as string, 10);
      const albumId = parseInt(over.id as string, 10);

      try {
        const { images } = get();
        const image = images.find((img) => img.id === imageId);

        if (!image) {
          set({ error: "Image not found" });
          return;
        }
        if (image.album_id === albumId) {
          return;
        }

        await get().editImage({
          id: imageId,
          albumId,
          title: image.title,
          description: image.description,
          is_favorite: image.is_favorite,
        });
      } catch (error) {
        set({ error: String(error) });
      }
    }
  },
}));
