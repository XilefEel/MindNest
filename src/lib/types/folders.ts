export type Folder = {
  id: number;
  nest_id: number;
  parent_id: number | null;
  name: string;
  created_at: string;
  updated_at: string;
};

export type NewFolder = {
  nest_id: number;
  parent_id: number | null;
  name: string;
};
