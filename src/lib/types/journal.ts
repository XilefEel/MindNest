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
