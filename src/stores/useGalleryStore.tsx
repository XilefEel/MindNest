import { create } from "zustand";
import { GalleryImage, GalleryAlbum, NewGalleryAlbum } from "@/lib/types";
import {
  importImage,
  getImages,
  updateImage,
  deleteImage,
  createAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  importImageData,
} from "@/lib/nestlings";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

type GalleryState = {
  images: GalleryImage[];
  albums: GalleryAlbum[];
  activeDraggingImageId: string | null;
  loading: boolean;
  error: string | null;

  fetchImages: (nestlingId: number) => Promise<void>;
  uploadImage: (
    nestlingId: number,
    file: {
      path?: string;
      name?: string;
      data?: Uint8Array;
    },
  ) => Promise<void>;
  editImage: ({
    id,
    albumId,
    title,
    description,
    tags,
  }: {
    id: number;
    albumId: number | null;
    title: string | null;
    description: string | null;
    tags: string | null;
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

  uploadImage: async (
    nestlingId: number,
    file: {
      path?: string;
      name?: string;
      data?: Uint8Array;
    },
  ) => {
    set({ loading: true, error: null });
    try {
      let newImage;
      if (file.path) {
        newImage = await importImage(nestlingId, file.path);
      } else {
        newImage = await importImageData(
          nestlingId,
          file.name!,
          Array.from(file.data!),
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

  editImage: async ({
    id,
    albumId,
    title,
    description,
    tags,
  }: {
    id: number;
    albumId: number | null;
    title: string | null;
    description: string | null;
    tags: string | null;
  }) => {
    set({ loading: true, error: null });
    try {
      await updateImage(id, albumId, title, description, tags);
      set((state) => ({
        images: state.images.map((img) =>
          img.id === id
            ? {
                ...img,
                albumId,
                title,
                description,
                tags,
                updated_at: new Date().toISOString(),
              }
            : img,
        ),
      }));
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

        get().editImage({
          id: imageId,
          albumId,
          title: image.title,
          description: image.description,
          tags: image.tags,
        });
        get().fetchImages(image.nestling_id);
      } catch (error) {
        set({ error: String(error) });
      }
    }
  },
}));
