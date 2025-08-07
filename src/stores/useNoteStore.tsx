import { create } from "zustand";

type NoteState = {
  present: string;
  past: string[];
  future: string[];
  updateNote: (note: string) => void;
  undo: () => void;
  redo: () => void;
  reset: (note: string) => void;
};

export const useNoteStore = create<NoteState>((set, get) => ({
  present: "",
  past: [],
  future: [],

  updateNote: (newContent: string) => {
    const { past, present } = get();
    set({ past: [...past, present], present: newContent, future: [] });
  },

  undo: () => {
    const { past, future, present } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    set({
      past: past.slice(0, past.length - 1),
      present: previous,
      future: [present, ...future],
    });
  },
  redo: () => {
    const { past, future, present } = get();
    if (future.length === 0) return;

    const next = future[0];
    set({
      past: [...past, present],
      present: next,
      future: future.slice(1),
    });
  },

  reset: (note: string) => {
    set({ past: [], future: [], present: note });
  },
}));
