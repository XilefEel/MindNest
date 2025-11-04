import { Folder } from "../types/folder";

export function findFolderPath(
  folderId: number | null,
  folders: Folder[],
): string | null {
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
}
