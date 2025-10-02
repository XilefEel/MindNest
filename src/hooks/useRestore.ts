import { getNestFromId } from "@/lib/api/nests";
import {
  saveLastNestId,
  getLastNestling,
  getLastBackgroundImage,
} from "@/lib/storage/session";
import { Nest } from "@/lib/types/nests";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
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
  const { setActiveNestling, setFolderOpen } = useNestlingTreeStore();
  const { setActiveNestId, setActiveBackgroundId, fetchBackgrounds } =
    useNestStore();

  if (!id) return;

  useEffect(() => {
    async function restore() {
      setLoading(true);

      try {
        //fetch last nest
        const lastNest = await getNestFromId(Number(id));
        setNest(lastNest);
        setActiveNestId(lastNest.id);
        await saveLastNestId(lastNest.id);

        // fetch last nestling and background
        const [lastNestling, lastBackgroundImage] = await Promise.all([
          getLastNestling(),
          getLastBackgroundImage(lastNest.id),
          fetchBackgrounds(lastNest.id),
        ]);

        if (lastNestling && Number(id) === lastNestling.nest_id) {
          setActiveNestling(lastNestling);
          if (lastNestling.folder_id) {
            setFolderOpen(lastNestling.folder_id, true);
          }
        }

        if (lastBackgroundImage != null) {
          setActiveBackgroundId(lastBackgroundImage);
        }
      } catch (error) {
        console.error("Failed to restore", error);
      } finally {
        setLoading(false);
      }
    }

    restore();
  }, [id]);
}
