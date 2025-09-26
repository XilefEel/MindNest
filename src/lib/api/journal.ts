import { invoke } from "@tauri-apps/api/core";
import {
  JournalEntry,
  JournalTemplate,
  NewJournalEntry,
  NewJournalTemplate,
} from "../types/journal";

export async function createJournalEntry(data: NewJournalEntry) {
  return await invoke<JournalEntry>("insert_journal_entry", { data });
}

export async function getJournalEntries(nestlingId: number) {
  return await invoke<JournalEntry[]>("get_journal_entries", { nestlingId });
}

export async function updateJournalEntry(
  id: number,
  title: string,
  content: string,
  entryDate: string,
) {
  return await invoke<void>("update_journal_entry", {
    id,
    title,
    content,
    entryDate,
  });
}

export async function deleteJournalEntry(id: number) {
  return await invoke<void>("delete_journal_entry", { id });
}

export async function createJournalTemplate(data: NewJournalTemplate) {
  return await invoke<JournalTemplate>("insert_journal_template", { data });
}

export async function getJournalTemplates(nestlingId: number) {
  return await invoke<JournalTemplate[]>("get_journal_templates", {
    nestlingId,
  });
}

export async function updateJournalTemplate(
  id: number,
  name: string,
  content: string,
) {
  return await invoke<void>("update_journal_template", { id, name, content });
}

export async function deleteJournalTemplate(id: number) {
  return await invoke<void>("delete_journal_template", { id });
}
