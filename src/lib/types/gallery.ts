import { WithBase } from "./base";
import { Photo as ReactPhotoAlbumPhoto } from "react-photo-album";

export type NewGalleryImage = {
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
  title: string;
  description: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};
