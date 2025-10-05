import { getNestFromId } from "@/lib/api/nests";
import {
  saveLastNestId,
  getLastNestling,
  getLastBackgroundImage,
} from "@/lib/storage/session";
import { Nest } from "@/lib/types/nests";
import { useNestlingStore } from "@/stores/useNestlingStore";
import { useNestStore } from "@/stores/useNestStore";
import { useEffect } from "react";

export default function useRestore({
  id,
  setNest,
  setLoading,
}: {
  id: string | undefined;
  setNest: (nest: Nest) => void;
  setLoading: (loading: boolean) => void;
}) {
  const { setActiveNestlingId, setFolderOpen, fetchSidebar } =
    useNestlingStore();
  const { setActiveNestId, setActiveBackgroundId, fetchBackgrounds } =
    useNestStore();

  if (!id) return;

  useEffect(() => {
    async function restore() {
      setLoading(true);
      try {
        // Fetch last nest and set as active
        const lastNest = await getNestFromId(Number(id));
        setNest(lastNest);
        setActiveNestId(lastNest.id);
        await saveLastNestId(lastNest.id);

        // Fetch last nestling and background from store and db
        const [lastNestlingId, lastBackgroundImage] = await Promise.all([
          getLastNestling(lastNest.id),
          getLastBackgroundImage(lastNest.id),
          fetchSidebar(lastNest.id),
          fetchBackgrounds(lastNest.id),
        ]);

        // Find last nestling from zustand store
        const lastNestling = useNestlingStore
          .getState()
          .nestlings.find((n) => n.id === lastNestlingId);

        // Set last nestling and its folder as active
        if (lastNestling && Number(id) === lastNestling.nest_id) {
          setActiveNestlingId(lastNestling.id);
          if (lastNestling.folder_id)
            setFolderOpen(lastNestling.folder_id, true);
        }

        // Set last background
        if (lastBackgroundImage != null)
          setActiveBackgroundId(lastBackgroundImage);
      } catch (error) {
        console.error("Failed to restore", error);
      } finally {
        setLoading(false);
      }
    }
    restore();
  }, [id]);
}
