import { useEffect, useState, useCallback } from "react";
import { getUserNests } from "@/lib/nests";
import { Nest } from "@/lib/types";

export default function useNests(userId: number) {
  const [nests, setNests] = useState<Nest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedNests = await getUserNests(userId);
      setNests(fetchedNests);
    } catch (err: any) {
      setError(err.message || "Failed to fetch nests");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNests();
  }, [fetchNests]);

  return { nests, loading, error, refetch: fetchNests };
}
