export type NewNestling = {
  nest_id: number;
  folder_id: number | null;
  nestling_type: string;
  title: string;
  content: string;
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
