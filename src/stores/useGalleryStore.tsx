import { create } from "zustand";
import { GalleryImage } from "@/lib/types/gallery";
import * as galleryApi from "@/lib/api/gallery";
import { open, save } from "@tauri-apps/plugin-dialog";
import {
  mergeWithCurrent,
  sortByFavorite,
  withStoreErrorHandler,
} from "@/lib/utils/general";
import { useShallow } from "zustand/react/shallow";
import { updateNestlingTimestamp } from "@/lib/utils/nestlings";
import { toast } from "@/lib/utils/toast";

type GalleryState = {
  images: GalleryImage[];
  loading: boolean;

  getImages: (nestlingId: number) => Promise<void>;
  selectImages: (nestlingId: number) => Promise<boolean>;
  uploadImage: ({
    nestlingId,
    file,
  }: {
    nestlingId: number;
    file: {
      path?: string;
      name?: string;
      data?: Uint8Array;
    };
  }) => Promise<void>;
  duplicateImage: (id: number) => Promise<GalleryImage>;
  updateImage: (id: number, updates: Partial<GalleryImage>) => Promise<void>;
  removeImage: (id: number) => Promise<void>;

  downloadImage: (id: number) => Promise<boolean>;
  downloadAll: (nestlingId: number) => Promise<boolean>;
};

export const useGalleryStore = create<GalleryState>((set, get) => ({
  images: [],
  loading: false,

  getImages: withStoreErrorHandler(set, async (nestlingId: number) => {
    const images = await galleryApi.getImages(nestlingId);
    set({ images });
  }),

  selectImages: withStoreErrorHandler(set, async (nestlingId: number) => {
    const selected = await open({
      title: "Upload Image",
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
      });
    }

    return true;
  }),

  uploadImage: withStoreErrorHandler(
    set,
    async ({
      nestlingId,
      file,
    }: {
      nestlingId: number;
      file: {
        path?: string;
        name?: string;
        data?: Uint8Array;
      };
    }) => {
      let newImage: GalleryImage = file.path
        ? await galleryApi.importImageFromPath(nestlingId, file.path)
        : await galleryApi.importImageFromData(
            nestlingId,
            file.name!,
            Array.from(file.data!),
          );

      set((state) => ({
        images: sortByFavorite([newImage, ...state.images]),
      }));

      await updateNestlingTimestamp(newImage.nestlingId);
    },
  ),

  duplicateImage: withStoreErrorHandler(set, async (id: number) => {
    const image = await galleryApi.duplicateImage(id);
    set((state) => ({
      images: sortByFavorite([image, ...state.images]),
    }));
    await updateNestlingTimestamp(image.nestlingId);
    return image;
  }),

  updateImage: withStoreErrorHandler(set, async (id, updates) => {
    const currentImage = get().images.find((img) => img.id === id);
    if (!currentImage) throw new Error("Image not found");

    const updated = mergeWithCurrent(currentImage, updates);

    set((state) => ({
      images: sortByFavorite(
        state.images.map((img) => (img.id === id ? updated : img)),
      ),
    }));

    await galleryApi.updateImage({ ...updated, id });

    await updateNestlingTimestamp(updated.nestlingId);
  }),

  removeImage: withStoreErrorHandler(set, async (id: number) => {
    const nestlingId = get().images.find((i) => i.id === id)?.nestlingId;

    await galleryApi.removeImage(id);
    set((state) => ({
      images: state.images.filter((image) => image.id !== id),
    }));

    if (nestlingId) {
      await updateNestlingTimestamp(nestlingId);
    }
  }),

  downloadImage: withStoreErrorHandler(set, async (id: number) => {
    const filePath = await save({
      title: "Save Image",
      defaultPath: `image_${id}.png`,
      filters: [
        {
          name: "Image Files",
          extensions: ["png", "jpeg", "jpg", "gif", "webp", "bmp"],
        },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (!filePath) return false;

    await galleryApi.downloadImage(id, filePath);

    return true;
  }),

  downloadAll: withStoreErrorHandler(set, async (nestlingId: number) => {
    const filePath = await save({
      title: "Save Gallery",
      defaultPath: `Gallery_${nestlingId}.zip`,
      filters: [{ name: "Zip Files", extensions: ["zip"] }],
    });

    if (!filePath) return false;

    toast.info("Downloading gallery...");
    await galleryApi.downloadAllImages(nestlingId, filePath);

    return true;
  }),
}));

export const useImages = () => useGalleryStore((state) => state.images);

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
      downloadAll: state.downloadAll,
    })),
  );
