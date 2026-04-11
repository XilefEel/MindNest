import { useEffect, useState } from "react";
import { getRecentNestlings } from "@/lib/storage/nestling";
import { useActiveNestId } from "@/stores/useNestStore";
import { useNestlings } from "@/stores/useNestlingStore";
import { Nestling } from "@/lib/types/nestling";

export function useRecentNestlings() {
  const activeNestId = useActiveNestId();
  const nestlings = useNestlings();
  const [recentNestlings, setRecentNestlings] = useState<Nestling[]>([]);

  useEffect(() => {
    async function fetchRecent() {
      if (!activeNestId) {
        setRecentNestlings([]);
        return;
      }

      const recentIds = (await getRecentNestlings(activeNestId)) || [];

      const recents = recentIds
        .map((id) => nestlings.find((n) => n.id === id))
        .filter((n): n is Nestling => Boolean(n));

      setRecentNestlings(recents);
    }

    fetchRecent();
  }, [activeNestId, nestlings]);

  return { recentNestlings, setRecentNestlings };
}
