import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getLastNestId, getLastNestling } from "@/lib/storage/session";
import { useNestlingStore } from "@/stores/useNestlingStore";
import { useNestStore } from "@/stores/useNestStore";

export default function SessionRestorer() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { setActiveNestId } = useNestStore();
  const { setActiveNestlingId, setFolderOpen } = useNestlingStore();

  const hasRestoredRef = useRef(false);

  useEffect(() => {
    const shouldRestore =
      user && !loading && location.pathname === "/" && !hasRestoredRef.current;

    if (!shouldRestore) return;
    hasRestoredRef.current = true;

    const restoreSession = async () => {
      const lastNestId = await getLastNestId();

      if (!lastNestId) {
        navigate("/dashboard");
        return;
      }
      setActiveNestId(lastNestId);
      navigate(`/nest/${lastNestId}`);

      const lastNestlingId = await getLastNestling(lastNestId);

      if (lastNestlingId != null) {
        const lastNestling = useNestlingStore
          .getState()
          .nestlings.find((n) => n.id === lastNestlingId);

        if (lastNestling) {
          setActiveNestlingId(lastNestling.id);
          if (lastNestling.folder_id != null) {
            setFolderOpen(lastNestling.folder_id, true);
          }
        }
      }
    };

    restoreSession();
  }, [
    user,
    loading,
    location.pathname,
    navigate,
    setActiveNestId,
    setActiveNestlingId,
    setFolderOpen,
  ]);

  return null;
}
