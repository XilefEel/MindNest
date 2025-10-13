import { WithBase } from "./base";

export type NewJournalEntry = {
  nestling_id: number;
  title: string;
  content: string;
  entry_date: string;
};

export type JournalEntry = WithBase<NewJournalEntry>;

export type NewJournalTemplate = {
  nestling_id: number;
  name: string;
  content: string;
};

export type JournalTemplate = WithBase<NewJournalTemplate>;
