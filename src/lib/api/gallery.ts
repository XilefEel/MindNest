import { invoke } from "@tauri-apps/api/core";
import {
  GalleryAlbum,
  GalleryImage,
  NewGalleryAlbum,
  NewGalleryImage,
} from "../types/gallery";

export async function addImage(data: NewGalleryImage) {
  return await invoke<GalleryImage>("add_image", { data });
}

export async function importImage(
  nestlingId: number,
  filePath: string,
  albumId?: number | null,
) {
  return await invoke<GalleryImage>("import_image", {
    nestlingId,
    albumId,
    filePath,
  });
}

export async function importImageData(
  nestlingId: number,
  fileName: string,
  fileData: number[],
  albumId?: number | null,
  title?: string | null,
  description?: string | null,
  isFavorite?: boolean,
) {
  return await invoke<GalleryImage>("import_image_data", {
    nestlingId,
    albumId,
    fileName,
    fileData,
    title,
    description,
    isFavorite,
  });
}

export async function duplicateImage(id: number) {
  return await invoke<GalleryImage>("duplicate_image", { originalImageId: id });
}

export async function getImages(nestlingId: number) {
  return await invoke<GalleryImage[]>("get_images", { nestlingId });
}

export async function downloadImage(id: number, savePath: string) {
  return await invoke("download_image", { id, savePath });
}

export async function downloadAlbum(id: number, savePath: string) {
  return await invoke("download_album", { id, savePath });
}

export async function updateImage(
  id: number,
  albumId: number | null,
  title: string | null,
  description: string | null,
  isFavorite: boolean,
) {
  console.log("updateImage", { id, albumId, title, description, isFavorite });
  return await invoke<void>("update_image", {
    id,
    albumId,
    title,
    description,
    isFavorite,
  });
}

export async function deleteImage(id: number) {
  return await invoke<void>("delete_image", { id });
}

export async function createAlbum(data: NewGalleryAlbum) {
  return await invoke<GalleryAlbum>("create_album", { data });
}

export async function getAlbums(nestlingId: number) {
  return await invoke<GalleryAlbum[]>("get_albums", { nestlingId });
}

export async function updateAlbum(
  id: number,
  name: string | null,
  description: string | null,
) {
  return await invoke<void>("update_album", { id, name, description });
}

export async function deleteAlbum(id: number) {
  return await invoke<void>("delete_album", { id });
}
