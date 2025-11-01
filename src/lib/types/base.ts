export type BaseModel = {
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type WithBase<T> = T & BaseModel;
