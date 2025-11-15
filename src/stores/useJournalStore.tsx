import * as journalApi from "@/lib/api/journal";
import {
  JournalEntry,
  JournalTemplate,
  NewJournalEntry,
  NewJournalTemplate,
} from "@/lib/types/journal";
import { mergeWithCurrent, withStoreErrorHandler } from "@/lib/utils/general";
import { create } from "zustand";
import { useNestlingStore } from "./useNestlingStore";
import { useShallow } from "zustand/react/shallow";

type JournalState = {
  activeEntry: JournalEntry | null;
  entries: JournalEntry[];
  templates: JournalTemplate[];
  loading: boolean;
  error: string | null;

  setActiveEntry: (entry: JournalEntry) => void;
  addEntry: (entry: NewJournalEntry) => Promise<JournalEntry>;
  getEntries: (nestlingId: number) => Promise<void>;
  updateEntry: (id: number, updates: Partial<JournalEntry>) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;

  addTemplate: (template: NewJournalTemplate) => Promise<JournalTemplate>;
  useTemplate: (
    nestlingId: number,
    template: JournalTemplate,
  ) => Promise<JournalEntry>;
  getTemplates: (nestlingId: number) => Promise<void>;
  updateTemplate: (
    id: number,
    updates: Partial<JournalTemplate>,
  ) => Promise<void>;
  deleteTemplate: (id: number) => Promise<void>;
};

export const useJournalStore = create<JournalState>((set, get) => ({
  activeEntry: null,
  entries: [],
  templates: [],
  loading: false,
  error: null,

  setActiveEntry: (entry: JournalEntry) => set({ activeEntry: entry }),

  addEntry: withStoreErrorHandler(set, async (entry: NewJournalEntry) => {
    const newEntry = await journalApi.createJournalEntry(entry);
    set((state) => ({
      entries: [...state.entries, newEntry],
      activeEntry: newEntry,
    }));
    useNestlingStore.getState().updateNestlingTimestamp(newEntry.nestlingId);
    return newEntry;
  }),

  getEntries: withStoreErrorHandler(set, async (nestlingId: number) => {
    const entries = await journalApi.getJournalEntries(nestlingId);
    set({ entries, loading: false });
  }),

  updateEntry: withStoreErrorHandler(set, async (id, updates) => {
    const current = get().entries.find((e) => e.id === id)!;
    if (!current) throw new Error("Entry not found");
    const updated = mergeWithCurrent(current, updates);

    await journalApi.updateJournalEntry({ ...updated, id });
    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? updated : e)),
    }));
    useNestlingStore.getState().updateNestlingTimestamp(updated.nestlingId);
  }),

  deleteEntry: withStoreErrorHandler(set, async (id: number) => {
    const nestlingId = get().entries.find((e) => e.id === id)?.nestlingId;

    await journalApi.deleteJournalEntry(id);
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
      activeEntry: state.activeEntry?.id === id ? null : state.activeEntry,
    }));

    if (nestlingId) {
      useNestlingStore.getState().updateNestlingTimestamp(nestlingId);
    }
  }),

  addTemplate: withStoreErrorHandler(
    set,
    async (template: NewJournalTemplate) => {
      const newTemplate = await journalApi.createJournalTemplate(template);
      set((state) => ({
        templates: [...state.templates, newTemplate],
      }));
      useNestlingStore
        .getState()
        .updateNestlingTimestamp(newTemplate.nestlingId);
      return newTemplate;
    },
  ),

  useTemplate: withStoreErrorHandler(
    set,
    async (nestlingId: number, template: JournalTemplate) => {
      const newEntry = await journalApi.createJournalEntry({
        nestlingId,
        title: template.name,
        content: template.content,
        entryDate: new Date().toISOString().split("T")[0],
      });
      set((state) => ({
        entries: [...state.entries, newEntry],
        activeEntry: newEntry,
      }));
      useNestlingStore.getState().updateNestlingTimestamp(newEntry.nestlingId);
      return newEntry;
    },
  ),

  getTemplates: withStoreErrorHandler(set, async (nestlingId: number) => {
    const templates = await journalApi.getJournalTemplates(nestlingId);
    set({ templates, loading: false });
  }),

  updateTemplate: withStoreErrorHandler(set, async (id, updates) => {
    const current = get().templates.find((t) => t.id === id)!;
    if (!current) throw new Error("Template not found");
    const updated = mergeWithCurrent(current, updates);

    await journalApi.updateJournalTemplate({ ...updated, id });

    set((state) => ({
      templates: state.templates.map((t) => (t.id === id ? updated : t)),
    }));
    useNestlingStore.getState().updateNestlingTimestamp(updated.nestlingId);
  }),

  deleteTemplate: withStoreErrorHandler(set, async (id: number) => {
    const nestlingId = get().templates.find((t) => t.id === id)?.nestlingId;

    await journalApi.deleteJournalTemplate(id);
    set((state) => ({
      templates: state.templates.filter((e) => e.id !== id),
    }));

    if (nestlingId) {
      useNestlingStore.getState().updateNestlingTimestamp(nestlingId);
    }
  }),
}));

export const useEntries = () => useJournalStore((state) => state.entries);

export const useTemplates = () => useJournalStore((state) => state.templates);

export const useJournalActions = () =>
  useJournalStore(
    useShallow((state) => ({
      setActiveEntry: state.setActiveEntry,
      addEntry: state.addEntry,
      getEntries: state.getEntries,
      updateEntry: state.updateEntry,
      deleteEntry: state.deleteEntry,

      addTemplate: state.addTemplate,
      useTemplate: state.useTemplate,
      getTemplates: state.getTemplates,
      updateTemplate: state.updateTemplate,
      deleteTemplate: state.deleteTemplate,
    })),
  );
