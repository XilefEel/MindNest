import { Folder } from "../types/folder";

export const findFolderPath = (folderId: number | null, folders: Folder[]) => {
  if (folderId === null) return null;

  const folderPath: string[] = [];
  const visitedFolders = new Set<number>();
  let current = folders.find((f) => f.id === folderId);

  while (current) {
    if (visitedFolders.has(current.id)) break;
    visitedFolders.add(current.id);

    folderPath.unshift(current.name);

    if (current.parentId === null) break;

    current = folders.find((f) => f.id === current!.parentId);
  }

  return folderPath.join("/");
};

export const isCircularReference = (
  folderId: number,
  newParentId: number | null,
  folders: Folder[],
): boolean => {
  const folderMap = new Map(folders.map((f) => [f.id, f.parentId]));
  let ancestorId: number | null = newParentId;

  while (ancestorId !== null) {
    if (ancestorId === folderId) return true;
    ancestorId = folderMap.get(ancestorId) ?? null;
  }

  return false;
};
