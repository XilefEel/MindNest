// src/hooks/useNestlingTree.ts
import { useCallback, useEffect, useState } from "react";
import {
  getFolders,
  getNestlings,
  updateNestlingFolder,
} from "@/lib/nestlings";
import { Folder, FolderWithNestlings, Nestling } from "@/lib/types";
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";

export function useNestlingTree(nestId: number) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [nestlings, setNestlings] = useState<Nestling[]>([]);
  const [openFolders, setOpenFolders] = useState<Record<number, boolean>>({});
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    if (!nestId) return;

    const loadData = async () => {
      try {
        const fetchedFolders = (await getFolders(nestId)) as Folder[];
        const fetchedNestlings = (await getNestlings(nestId)) as Nestling[];

        setFolders(fetchedFolders);
        setNestlings(fetchedNestlings);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    loadData();
  }, [nestId]);

  const folderGroups: FolderWithNestlings[] = folders.map((folder) => ({
    ...folder,
    nestlings: nestlings.filter((n) => n.folder_id === folder.id),
  }));

  const looseNestlings: Nestling[] = nestlings.filter(
    (n) => n.folder_id === null,
  );

  const toggleFolder = (folderId: number) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const refreshData = useCallback(async () => {
    console.log("Refreshing data...");
    try {
      const fetchedFolders = (await getFolders(nestId)) as Folder[];
      const fetchedNestlings = (await getNestlings(nestId)) as Nestling[];

      const sortedFolders = [...fetchedFolders].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      const sortedNestlings = [...fetchedNestlings].sort((a, b) =>
        a.title.localeCompare(b.title),
      );

      setFolders(sortedFolders);
      setNestlings(sortedNestlings);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
  }, [nestId]);

  function handleDragStart(event: DragStartEvent) {
    console.log("➡️ Drag started:", event.active.id);
    setActiveId(event.active.id as number);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const [activeType, activeIdStr] = String(active.id).split("-");
    const [overType, overIdStr] = String(over.id).split("-");

    if (activeType !== "nestling") return;

    const nestlingId = Number(activeIdStr);

    try {
      if (overType === "folder") {
        const folderId = Number(overIdStr);
        await updateNestlingFolder(nestlingId, folderId);
        console.log(`Moved nestling ${nestlingId} to folder ${folderId}`);
      } else if (overType === "loose") {
        await updateNestlingFolder(nestlingId, null);
        console.log(`Moved nestling ${nestlingId} out of folder`);
      }
    } catch (err) {
      console.error("Failed to update folder:", err);
    } finally {
      await refreshData();
    }
  }

  return {
    folderGroups,
    looseNestlings,
    activeId,
    openFolders,
    handleDragStart,
    handleDragEnd,
    toggleFolder,
    refreshData,
  };
}

export type UseNestlingTreeResult = ReturnType<typeof useNestlingTree>;
