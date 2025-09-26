export type GalleryAlbum = {
  id: number;
  nestling_id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type NewGalleryAlbum = {
  nestling_id: number;
  name: string;
  description: string | null;
};

export type GalleryImage = {
  id: number;
  album_id: number | null;
  nestling_id: number;
  file_path: string;
  title: string | null;
  description: string | null;
  is_favorite: boolean;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
};

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
