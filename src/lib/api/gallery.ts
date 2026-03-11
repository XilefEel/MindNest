import { invoke } from "@tauri-apps/api/core";
import { GalleryImage } from "../types/gallery";

export async function importImageFromPath(
  nestlingId: number,
  filePath: string,
) {
  return await invoke<GalleryImage>("import_image_from_path", {
    nestlingId,
    albumId: null,
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
    albumId: null,
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
  albumId,
  title,
  description,
  isFavorite,
}: {
  id: number;
  albumId: number | null;
  title: string | null;
  description: string | null;
  isFavorite: boolean;
}) {
  await invoke<void>("update_image", {
    id,
    albumId,
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

// export async function createAlbum(data: NewGalleryAlbum) {
//   return await invoke<GalleryAlbum>("create_album", { data });
// }

// export async function getAlbums(nestlingId: number) {
//   return await invoke<GalleryAlbum[]>("get_albums", { nestlingId });
// }

// export async function updateAlbum({
//   id,
//   name,
//   description,
// }: {
//   id: number;
//   name: string | null;
//   description: string | null;
// }) {
//   await invoke<void>("update_album", { id, name, description });
// }

// export async function deleteAlbum(id: number) {
//   await invoke<void>("delete_album", { id });
// }
