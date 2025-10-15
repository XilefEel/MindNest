import { create } from "zustand";
import {
  GalleryImage,
  GalleryAlbum,
  NewGalleryAlbum,
} from "@/lib/types/gallery";
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
  duplicateImage,
} from "@/lib/api/gallery";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import { withStoreErrorHandler } from "@/lib/utils/general";

type GalleryState = {
  images: GalleryImage[];
  albums: GalleryAlbum[];
  activeDraggingImageId: string | null;
  loading: boolean;
  error: string | null;

  fetchImages: (nestlingId: number) => Promise<void>;
  selectImages: (
    nestlingId: number,
    albumId?: number | null,
  ) => Promise<boolean>;
  uploadImage: ({
    nestlingId,
    file,
    album_id,
  }: {
    nestlingId: number;
    file: {
      path?: string;
      name?: string;
      data?: Uint8Array;
    };
    album_id?: number | null;
  }) => Promise<void>;
  duplicateImage: (id: number) => Promise<GalleryImage>;
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
  downloadImage: (id: number) => Promise<void>;

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
  albums: [],
  activeDraggingImageId: null,

  loading: false,
  error: null,

  fetchImages: withStoreErrorHandler(set, async (nestlingId: number) => {
    const images = await getImages(nestlingId);
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
          album_id: albumId,
        });
      }
      await get().fetchImages(nestlingId);

      return true;
    },
  ),

  uploadImage: withStoreErrorHandler(
    set,
    async ({
      nestlingId,
      file,
      album_id,
    }: {
      nestlingId: number;
      file: {
        path?: string;
        name?: string;
        data?: Uint8Array;
      };
      album_id?: number | null;
    }) => {
      let newImage: GalleryImage;
      newImage = file.path
        ? await importImage(nestlingId, file.path, album_id)
        : await importImageData(
            nestlingId,
            file.name!,
            Array.from(file.data!),
            album_id,
          );

      set((state) => ({
        images: [...state.images, newImage],
      }));
    },
  ),

  duplicateImage: withStoreErrorHandler(set, async (id: number) => {
    const image = await duplicateImage(id);
    set((state) => ({
      images: [...state.images, image],
    }));
    return image;
  }),

  editImage: withStoreErrorHandler(
    set,
    async ({
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
    },
  ),

  removeImage: withStoreErrorHandler(set, async (id: number) => {
    await deleteImage(id);
    set((state) => ({
      images: state.images.filter((image) => image.id !== id),
    }));
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
    await downloadImage(id, filePath);
  }),

  fetchAlbums: withStoreErrorHandler(set, async (nestlingId: number) => {
    const albums = await getAlbums(nestlingId);
    set({ albums });
  }),

  addAlbum: withStoreErrorHandler(set, async (data: NewGalleryAlbum) => {
    const newAlbum = await createAlbum(data);
    set((state) => ({
      albums: [...state.albums, newAlbum],
    }));
  }),

  downloadAlbum: withStoreErrorHandler(set, async (id: number) => {
    const filePath = await save({
      title: "Save Album",
      defaultPath: `Album_${id}.zip`,
      filters: [{ name: "Zip Files", extensions: ["zip"] }],
    });

    if (!filePath) throw new Error("Download canceled");

    await downloadAlbum(id, filePath);
    set({ loading: false });
  }),

  editAlbum: withStoreErrorHandler(
    set,
    async ({
      id,
      name,
      description,
    }: {
      id: number;
      name: string | null;
      description: string | null;
    }) => {
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
      }));
    },
  ),

  removeAlbum: withStoreErrorHandler(set, async (id: number) => {
    await deleteAlbum(id);
    set((state) => ({
      albums: state.albums.filter((album) => album.id !== id),
    }));
  }),

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
        if (image.album_id === albumId) return;

        await get().editImage({
          id: imageId,
          albumId,
          title: image.title,
          description: image.description,
          is_favorite: image.is_favorite ?? false,
        });
      } catch (error) {
        set({ error: String(error) });
      }
    }
  },
}));
