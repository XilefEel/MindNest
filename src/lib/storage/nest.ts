import { setItem, getItem, deleteItem } from "./storage";

export async function saveLastNestId(nestId: number) {
  return setItem("lastNestId", nestId);
}

export async function getLastNestId(): Promise<number | null> {
  return getItem<number>("lastNestId");
}

export async function clearLastNestId() {
  return deleteItem("lastNestId");
}
