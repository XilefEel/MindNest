import { invoke } from "@tauri-apps/api/core";
import { NewNoteTemplate, NoteTemplate } from "../types/note";

export async function editNote(
  nestlingId: number,
  title: string | null,
  content: string | null,
) {
  await invoke<void>("edit_note", {
    id: nestlingId,
    title,
    content,
  });
}

export async function createNoteTemplate(data: NewNoteTemplate) {
  return await invoke<NoteTemplate>("create_note_template", { data });
}

export async function getNoteTemplates(nestId: number) {
  return await invoke<NoteTemplate[]>("get_note_templates", { nestId });
}

export async function updateNoteTemplate({
  id,
  name,
  content,
}: {
  id: number;
  name: string;
  content: string;
}) {
  await invoke<void>("update_note_template", { id, name, content });
}

export async function deleteNoteTemplate(id: number) {
  await invoke<void>("delete_note_template", { id });
}
