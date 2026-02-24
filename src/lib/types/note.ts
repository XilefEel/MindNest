import { WithBase } from "./base";

export type NewNoteTemplate = {
  nestId: number;
  name: string;
  content: string;
};

export type NoteTemplate = WithBase<NewNoteTemplate>;
