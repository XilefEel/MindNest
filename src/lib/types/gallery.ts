import { WithBase } from "./base";

export type NewGalleryAlbum = {
  nestling_id: number;
  name: string;
  description: string | null;
};

export type GalleryAlbum = WithBase<NewGalleryAlbum>;

export type NewGalleryImage = {
  album_id: number | null;
  nestling_id: number;
  file_path: string;
  title: string | null;
  description: string | null;
  is_favorite?: boolean;
  width: number;
  height: number;
};

export type GalleryImage = WithBase<NewGalleryImage>;
