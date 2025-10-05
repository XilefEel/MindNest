import { useNestlingStore } from "@/stores/useNestlingStore";

export default function useActiveNestling() {
  const { activeNestlingId, nestlings } = useNestlingStore();
  const activeNestling = nestlings.find((n) => n.id === activeNestlingId)!;
  return { activeNestling, activeNestlingId };
}
