import {
  createJournalEntry,
  createJournalTemplate,
  deleteJournalEntry,
  deleteJournalTemplate,
  getJournalEntries,
  getJournalTemplates,
  updateJournalEntry,
  updateJournalTemplate,
} from "@/lib/api/journal";
import {
  JournalEntry,
  JournalTemplate,
  NewJournalEntry,
  NewJournalTemplate,
} from "@/lib/types/journal";
import { withStoreErrorHandler } from "@/lib/utils/general";
import { create } from "zustand";

type JournalState = {
  activeEntry: JournalEntry | null;
  entries: JournalEntry[];
  templates: JournalTemplate[];
  loading: boolean;
  error: string | null;

  setActiveEntry: (entry: JournalEntry) => void;
  addEntry: (entry: NewJournalEntry) => Promise<JournalEntry>;
  fetchEntries: (nestlingId: number) => Promise<void>;
  updateEntry: (entry: JournalEntry) => Promise<JournalEntry>;
  deleteEntry: (id: number) => Promise<void>;

  addTemplate: (template: NewJournalTemplate) => Promise<JournalTemplate>;
  useTemplate: (
    nestlingId: number,
    template: JournalTemplate,
  ) => Promise<JournalEntry>;
  fetchTemplates: (nestlingId: number) => Promise<void>;
  updateTemplate: (template: JournalTemplate) => Promise<JournalTemplate>;
  deleteTemplate: (id: number) => Promise<void>;
};

export const useJournalStore = create<JournalState>((set) => ({
  activeEntry: null,
  entries: [],
  templates: [],
  loading: false,
  error: null,

  setActiveEntry: (entry: JournalEntry) => set({ activeEntry: entry }),

  addEntry: withStoreErrorHandler(set, async (entry: NewJournalEntry) => {
    const newEntry = await createJournalEntry(entry);
    set((state) => ({
      entries: [...state.entries, newEntry],
      activeEntry: newEntry,
    }));

    return newEntry;
  }),

  fetchEntries: withStoreErrorHandler(set, async (nestlingId: number) => {
    const entries = await getJournalEntries(nestlingId);
    set({ entries, loading: false });
  }),

  updateEntry: withStoreErrorHandler(set, async (entry: JournalEntry) => {
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
    }));

    return updatedEntries;
  }),
  deleteEntry: withStoreErrorHandler(set, async (id: number) => {
    await deleteJournalEntry(id);
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
      activeEntry: state.activeEntry?.id === id ? null : state.activeEntry,
    }));
  }),

  addTemplate: withStoreErrorHandler(
    set,
    async (template: NewJournalTemplate) => {
      const newTemplate = await createJournalTemplate(template);
      set((state) => ({
        templates: [...state.templates, newTemplate],
      }));
      return newTemplate;
    },
  ),

  useTemplate: withStoreErrorHandler(
    set,
    async (nestlingId: number, template: JournalTemplate) => {
      const newEntry = await createJournalEntry({
        nestling_id: nestlingId,
        title: template.name,
        content: template.content,
        entry_date: new Date().toISOString().split("T")[0],
      });
      set((state) => ({
        entries: [...state.entries, newEntry],
        activeEntry: newEntry,
      }));
      return newEntry;
    },
  ),

  fetchTemplates: withStoreErrorHandler(set, async (nestlingId: number) => {
    const templates = await getJournalTemplates(nestlingId);
    set({ templates, loading: false });
  }),

  updateTemplate: withStoreErrorHandler(
    set,
    async (template: JournalTemplate) => {
      await updateJournalTemplate(template.id, template.name, template.content);
      const updatedTemplates = {
        ...template,
        updated_at: new Date().toISOString(),
      };

      set((state) => ({
        templates: state.templates.map((t) =>
          t.id === template.id ? updatedTemplates : t,
        ),
      }));

      return updatedTemplates;
    },
  ),

  deleteTemplate: withStoreErrorHandler(set, async (id: number) => {
    await deleteJournalTemplate(id);
    set((state) => ({
      templates: state.templates.filter((e) => e.id !== id),
    }));
  }),
}));
