import { WithBase } from "./base";

export type NewNoteTemplate = {
  nestlingId: number;
  name: string;
  content: string;
};

export type NoteTemplate = WithBase<NewNoteTemplate>;
