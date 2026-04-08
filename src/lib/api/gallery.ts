import { invoke } from "@tauri-apps/api/core";
import { GalleryImage } from "../types/gallery";

export async function importImageFromPath(
  nestlingId: number,
  filePath: string,
) {
  return await invoke<GalleryImage>("import_image_from_path", {
    nestlingId,
    filePath,
  });
}

export async function importImageFromData(
  nestlingId: number,
  fileName: string,
  fileData: number[],
) {
  return await invoke<GalleryImage>("import_image_from_data", {
    nestlingId,
    fileName,
    fileData,
    title: null,
    description: null,
    isFavorite: false,
  });
}

export async function duplicateImage(id: number) {
  return await invoke<GalleryImage>("duplicate_image", { originalImageId: id });
}

export async function getImages(nestlingId: number) {
  return await invoke<GalleryImage[]>("get_images", { nestlingId });
}

export async function updateImage({
  id,
  title,
  description,
  isFavorite,
}: {
  id: number;
  title: string | null;
  description: string | null;
  isFavorite: boolean;
}) {
  await invoke<void>("update_image", {
    id,
    title,
    description,
    isFavorite,
  });
}

export async function removeImage(id: number) {
  await invoke<void>("delete_image", { id });
}

export async function downloadImage(id: number, savePath: string) {
  await invoke<void>("download_image", { id, savePath });
}

export async function downloadAllImages(nestlingId: number, savePath: string) {
  await invoke<void>("download_all_images", { nestlingId, savePath });
}
