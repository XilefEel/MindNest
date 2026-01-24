import { WithBase } from "./base";

export type NewBookmark = {
  nestlingId: number;
  url: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  faviconUrl: string | null;
};

export type Bookmark = WithBase<NewBookmark>;
