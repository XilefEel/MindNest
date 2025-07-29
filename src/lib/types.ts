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
