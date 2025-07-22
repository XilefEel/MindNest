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
