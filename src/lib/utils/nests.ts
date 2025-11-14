import { useNestStore } from "@/stores/useNestStore";

export const getActiveNestId = () => {
  const nestId = useNestStore.getState().activeNestId;
  if (!nestId) {
    throw new Error("activeNestId is null");
  }
  return nestId;
};
