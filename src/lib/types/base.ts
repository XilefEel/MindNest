export type BaseModel = {
  id: number;
  created_at: string;
  updated_at: string;
};

export type WithBase<T> = T & BaseModel;
