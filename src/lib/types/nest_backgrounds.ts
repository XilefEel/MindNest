export type BackgroundImage = {
  id: number;
  nest_id: number;
  file_path: string;
  is_selected: boolean;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
};

export type NewBackgroundImage = {
  nest_id: number;
  file_path: string;
  is_selected: boolean;
  width: number;
  height: number;
};
