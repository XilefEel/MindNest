import { getNestFromId } from "@/lib/api/nest";
import {
  getLastBackgroundImage,
  getStoredBackgroundImage,
  getLastBackgroundImageBrightness,
} from "@/lib/storage/background-image";
import {
  getLastBackgroundMusic,
  getLastMusicVolume,
} from "@/lib/storage/background-music";
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
  id: number;
  setNest: (nest: Nest) => void;
  setLoading: (loading: boolean) => void;
}) {
  const {
    setActiveNestId,
    setActiveBackgroundId,
    setStoredBackgroundId,
    setActiveMusicId,
    setBackgroundBrightness,
    setMusicVolume,
    getNests,
    getBackgrounds,
    getMusic,
  } = useNestActions();

  const {
    setActiveNestlingId,
    setActiveFolderId,
    setFolderOpen,
    fetchSidebar,
    getTags,
    getAllNestlingTags,
  } = useNestlingActions();

  const { loadSettings } = useSettingsStore();

  useEffect(() => {
    if (!id) return;

    async function restore() {
      setLoading(true);

      try {
        const lastNest = await getNestFromId(id);
        setNest(lastNest);
        setActiveNestId(lastNest.id);
        await saveLastNestId(lastNest.id);

        const [
          lastNestlingId,
          lastBackgroundImage,
          storedBackgroundImage,
          lastBackgroundMusicId,
          lastBackgroundImageBrightness,
          lastMusicVolume,
        ] = await Promise.all([
          getLastNestling(lastNest.id),
          getLastBackgroundImage(lastNest.id),
          getStoredBackgroundImage(lastNest.id),
          getLastBackgroundMusic(lastNest.id),
          getLastBackgroundImageBrightness(lastNest.id),
          getLastMusicVolume(lastNest.id),
        ]);

        await Promise.all([
          loadSettings(),
          fetchSidebar(lastNest.id),
          getNests(lastNest.userId),
          getBackgrounds(lastNest.id),
          getMusic(lastNest.id),
          getTags(lastNest.id),
          getAllNestlingTags(lastNest.id),
        ]);

        const lastNestling = useNestlingStore
          .getState()
          .nestlings.find((n) => n.id === lastNestlingId);

        if (lastNestling && id === lastNestling.nestId) {
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

        setActiveBackgroundId(lastBackgroundImage);

        setStoredBackgroundId(storedBackgroundImage);

        if (lastBackgroundImageBrightness != null) {
          setBackgroundBrightness(lastBackgroundImageBrightness);
        }

        if (lastBackgroundMusicId != null)
          setActiveMusicId(lastBackgroundMusicId);

        if (lastMusicVolume != null) {
          setMusicVolume(lastMusicVolume);
        }
      } catch (error) {
        toast.error("Failed to restore nest.");
      } finally {
        setLoading(false);
      }
    }

    restore();
  }, [id]);
}
