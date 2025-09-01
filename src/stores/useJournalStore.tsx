import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntries,
  updateJournalEntry,
} from "@/lib/nestlings";
import {
  JournalEntry,
  JournalTemplate,
  NewJournalEntry,
  NewJournalTemplate,
} from "@/lib/types";
import { create } from "zustand";

type JournalState = {
  activeEntry: JournalEntry | null;
  entries: JournalEntry[];
  templates: JournalTemplate[];
  loading: boolean;
  error: string | null;

  // Entry Actions
  setActiveEntry: (entry: JournalEntry) => void;
  addEntry: (entry: NewJournalEntry) => Promise<JournalEntry>;
  fetchEntries: (nestlingId: number) => Promise<void>;
  updateEntry: (entry: JournalEntry) => Promise<JournalEntry>;
  deleteEntry: (id: number) => Promise<void>;

  // Template Actions
  //   addTemplate: (template: NewJournalTemplate) => Promise<JournalTemplate>;
  //   fetchTemplates: (nestlingId: number) => Promise<void>;
  //   updateTemplate: (template: JournalTemplate) => Promise<JournalTemplate>;
  //   deleteTemplate: (id: number) => Promise<void>;
};

export const useJournalStore = create<JournalState>((set, get) => ({
  activeEntry: null,
  entries: [],
  templates: [],
  loading: false,
  error: null,

  setActiveEntry: (entry: JournalEntry) => set({ activeEntry: entry }),
  addEntry: async (entry: NewJournalEntry) => {
    set({ loading: true, error: null });
    try {
      const newEntry = await createJournalEntry(entry);
      set((state) => ({
        entries: [...state.entries, newEntry],
        loading: false,
      }));
      return newEntry;
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },
  fetchEntries: async (nestlingId: number) => {
    set({ loading: true, error: null });
    try {
      const entries = await getJournalEntries(nestlingId);
      console.log("Entries fetched:", entries);
      set({ entries, loading: false });
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },
  updateEntry: async (entry: JournalEntry) => {
    set({ loading: true, error: null });
    try {
      await updateJournalEntry(
        entry.id,
        entry.title,
        entry.content,
        entry.entry_date,
      );
      const updatedEntries = {
        ...entry,
        updated_at: new Date().toISOString(),
      };

      set((state) => ({
        entries: state.entries.map((e) =>
          e.id === entry.id ? updatedEntries : e,
        ),
        activeEntry: state.activeEntry?.id === entry.id ? updatedEntries : null,
        loading: false,
      }));

      return updatedEntries;
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },
  deleteEntry: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await deleteJournalEntry(id);
      set((state) => ({
        entries: state.entries.filter((e) => e.id !== id),
        activeEntry: state.activeEntry?.id === id ? null : state.activeEntry,
        loading: false,
      }));
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },

  //   addTemplate: async (template: NewJournalTemplate) => {},
  //   fetchTemplates: async (nestlingId: number) => {},
  //   updateTemplate: async (template: JournalTemplate) => {},
  //   deleteTemplate: async (id: number) => {},
}));
