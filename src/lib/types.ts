export type SignupData = {
  username: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
};

export type Nest = {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
};

export type NewNest = {
  user_id: number;
  title: string;
};

export type NewNestling = {
  nest_id: number;
  folder_id: number | null;
  nestling_type: string;
  title: string;
  content: string;
};

export type NewFolder = {
  nest_id: number;
  name: string;
};

export type Nestling = {
  id: number;
  nest_id: number;
  folder_id: number | null;
  nestling_type: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type Folder = {
  id: number;
  nest_id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type FolderWithNestlings = Folder & {
  nestlings: Nestling[];
};

export type BoardColumn = {
  id: number;
  nestling_id: number;
  title: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type NewBoardColumn = {
  nestling_id: number;
  title: string;
  order_index: number;
};

export type BoardCard = {
  id: number;
  column_id: number;
  title: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type NewBoardCard = {
  column_id: number;
  title: string;
  description: string | null;
  order_index: number;
};

export type BoardData = {
  nestling: Nestling;
  columns: BoardColumnData[];
};

export type BoardColumnData = {
  column: BoardColumn;
  cards: BoardCard[];
};

export type PlannerEventType = {
  id: number;
  nestling_id: number;
  date: string;
  title: string;
  description: string | null;
  start_time: number;
  duration: number;
  color: string;
  created_at: string;
  updated_at: string;
};

export type NewPlannerEventType = {
  nestling_id: number;
  date: string;
  title: string;
  description: string | null;
  start_time: number;
  duration: number;
  color: string;
};

export type JournalEntry = {
  id: number;
  nestling_id: number;
  title: string;
  content: string;
  entry_date: string;
  created_at: string;
  updated_at: string;
};

export type NewJournalEntry = {
  nestling_id: number;
  title: string;
  content: string;
  entry_date: string;
};

export type JournalTemplate = {
  id: number;
  nestling_id: number;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type NewJournalTemplate = {
  nestling_id: number;
  name: string;
  content: string;
};

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
  tags: string | null;
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
  tags: string | null;
  width: number;
  height: number;
};
