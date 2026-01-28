import { WithBase } from "./base";
import { Photo as ReactPhotoAlbumPhoto } from "react-photo-album";

export type NewGalleryAlbum = {
  nestlingId: number;
  name: string;
  description: string | null;
};

export type GalleryAlbum = WithBase<NewGalleryAlbum>;

export type NewGalleryImage = {
  albumId: number | null;
  nestlingId: number;
  filePath: string;
  title: string | null;
  description: string | null;
  isFavorite: boolean;
  width: number;
  height: number;
};

export type GalleryImage = WithBase<NewGalleryImage>;

export type Photo = ReactPhotoAlbumPhoto & {
  id: number;
  albumId: number | null;
  title: string;
  description: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};
