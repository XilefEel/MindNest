export type Bookmark = {
  id: number;
  nestling_id: number;
  url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  favicon_url: string | null;
  created_at: string;
  updated_at: string;
};

export type NewBookmark = {
  nestling_id: number;
  url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  favicon_url: string | null;
};

export type BookmarkMetadata = {
  title: string | null;
  description: string | null;
  image_url: string | null;
  favicon_url: string | null;
};
