import { WithBase } from "./base";

export type NewJournalEntry = {
  nestlingId: number;
  title: string;
  content: string;
  entryDate: string;
};

export type JournalEntry = WithBase<NewJournalEntry>;

export type NewJournalTemplate = {
  nestlingId: number;
  name: string;
  content: string;
};

export type JournalTemplate = WithBase<NewJournalTemplate>;
