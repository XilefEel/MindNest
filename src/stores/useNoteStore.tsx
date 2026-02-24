import * as noteApi from "@/lib/api/note";
import { NoteTemplate, NewNoteTemplate } from "@/lib/types/note";
import { mergeWithCurrent, withStoreErrorHandler } from "@/lib/utils/general";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { updateNestlingTimestamp } from "@/lib/utils/nestlings";
import { useNestlingStore } from "@/stores/useNestlingStore.tsx";

type NoteState = {
  templates: NoteTemplate[];
  loading: boolean;
  error: string | null;

  addTemplate: (template: NewNoteTemplate) => Promise<NoteTemplate>;
  useTemplate: (nestId: number, template: NoteTemplate) => Promise<void>;
  getTemplates: (nestId: number) => Promise<void>;
  updateTemplate: (id: number, updates: Partial<NoteTemplate>) => Promise<void>;
  deleteTemplate: (id: number) => Promise<void>;
};

export const useNoteStore = create<NoteState>((set, get) => ({
  activeEntry: null,
  entries: [],
  templates: [],
  loading: false,
  error: null,

  addTemplate: withStoreErrorHandler(set, async (template: NewNoteTemplate) => {
    const newTemplate = await noteApi.createNoteTemplate(template);

    set((state) => ({
      templates: [...state.templates, newTemplate],
    }));

    await updateNestlingTimestamp(newTemplate.nestId);
    return newTemplate;
  }),

  useTemplate: withStoreErrorHandler(
    set,
    async (nestId: number, template: NoteTemplate) => {
      await useNestlingStore.getState().updateNestling(nestId, {
        content: template.content,
      });
    },
  ),

  getTemplates: withStoreErrorHandler(set, async (nestId: number) => {
    const templates = await noteApi.getNoteTemplates(nestId);
    set({ templates, loading: false });
  }),

  updateTemplate: withStoreErrorHandler(set, async (id, updates) => {
    const current = get().templates.find((t) => t.id === id)!;
    if (!current) throw new Error("Template not found");

    const updated = mergeWithCurrent(current, updates);

    await noteApi.updateNoteTemplate({ ...updated, id });

    set((state) => ({
      templates: state.templates.map((t) => (t.id === id ? updated : t)),
    }));
    await updateNestlingTimestamp(updated.nestId);
  }),

  deleteTemplate: withStoreErrorHandler(set, async (id: number) => {
    await Promise.all([
      noteApi.deleteNoteTemplate(id),
      updateNestlingTimestamp(id),
    ]);

    set((state) => ({
      templates: state.templates.filter((e) => e.id !== id),
    }));
  }),
}));

export const useTemplates = () => useNoteStore((state) => state.templates);

export const useNoteActions = () =>
  useNoteStore(
    useShallow((state) => ({
      addTemplate: state.addTemplate,
      useTemplate: state.useTemplate,
      getTemplates: state.getTemplates,
      updateTemplate: state.updateTemplate,
      deleteTemplate: state.deleteTemplate,
    })),
  );
