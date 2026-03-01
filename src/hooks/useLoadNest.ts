import { getNestFromId } from "@/lib/api/nest";
import {
  getLastBackgroundImage,
  getStoredBackgroundImage,
} from "@/lib/storage/background-image";
import { getLastBackgroundMusic } from "@/lib/storage/background-music";
import { saveLastNestId } from "@/lib/storage/nest";
import { getLastNestling } from "@/lib/storage/nestling";
import { Nest } from "@/lib/types/nest";
import { toast } from "@/lib/utils/toast";
import {
  useNestlingActions,
  useNestlingStore,
} from "@/stores/useNestlingStore";
import { useNestActions } from "@/stores/useNestStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useEffect } from "react";

export default function useLoadNest({
  id,
  setNest,
  setLoading,
}: {
  id: string | undefined;
  setNest: (nest: Nest) => void;
  setLoading: (loading: boolean) => void;
}) {
  const {
    setActiveNestlingId,
    setActiveFolderId,
    setFolderOpen,
    fetchSidebar,
    getTags,
    getAllNestlingTags,
  } = useNestlingActions();

  const {
    setActiveNestId,
    setActiveBackgroundId,
    setStoredBackgroundId,
    setActiveMusicId,
    getBackgrounds,
    getMusic,
  } = useNestActions();

  const { loadSettings } = useSettingsStore();

  if (!id) return;

  useEffect(() => {
    async function restore() {
      setLoading(true);
      try {
        const lastNest = await getNestFromId(Number(id));
        setNest(lastNest);
        setActiveNestId(lastNest.id);
        await saveLastNestId(lastNest.id);

        const [
          lastNestlingId,
          lastBackgroundImage,
          lastBackgroundMusicId,
          storedBackgroundImage,
        ] = await Promise.all([
          getLastNestling(lastNest.id),
          getLastBackgroundImage(lastNest.id),
          getLastBackgroundMusic(lastNest.id),
          getStoredBackgroundImage(lastNest.id),

          loadSettings(),
          fetchSidebar(lastNest.id),
          getBackgrounds(lastNest.id),
          getMusic(lastNest.id),
          getTags(lastNest.id),
          getAllNestlingTags(lastNest.id),
        ]);

        const lastNestling = useNestlingStore
          .getState()
          .nestlings.find((n) => n.id === lastNestlingId);

        if (lastNestling && Number(id) === lastNestling.nestId) {
          setActiveNestlingId(lastNestling.id);

          if (lastNestling.folderId) {
            let currentFolderId: number | null = lastNestling.folderId;

            while (currentFolderId) {
              setFolderOpen(currentFolderId, true);
              const currentFolder = useNestlingStore
                .getState()
                .folders.find((f) => f.id === currentFolderId);
              currentFolderId = currentFolder?.parentId || null;
            }

            setActiveFolderId(lastNestling.folderId);
          }
        }

        if (lastBackgroundImage != null)
          setActiveBackgroundId(lastBackgroundImage);

        if (storedBackgroundImage != null)
          setStoredBackgroundId(storedBackgroundImage);

        if (lastBackgroundMusicId != null)
          setActiveMusicId(lastBackgroundMusicId);
      } catch (error) {
        toast.error("Failed to restore.");
      } finally {
        setLoading(false);
      }
    }
    restore();
  }, [id]);
}
