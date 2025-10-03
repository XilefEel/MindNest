import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getLastNestId, getLastNestling } from "@/lib/storage/session";
import { useNestlingTreeStore } from "@/stores/useNestlingStore";
import { useNestStore } from "@/stores/useNestStore";

export default function SessionRestorer() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { setActiveNestId, activeNestId } = useNestStore();
  const { setActiveNestling, setFolderOpen } = useNestlingTreeStore();

  const hasRestoredRef = useRef(false);

  useEffect(() => {
    const shouldRestore =
      user && !loading && location.pathname === "/" && !hasRestoredRef.current;

    if (!shouldRestore) return;

    hasRestoredRef.current = true;

    const restoreSession = async () => {
      const lastNestId = await getLastNestId();
      const lastNestling = await getLastNestling(activeNestId!);

      if (lastNestId) {
        setActiveNestId(lastNestId);
        navigate(`/nest/${lastNestId}`);

        if (lastNestling) {
          setActiveNestling(lastNestling);
          if (lastNestling.folder_id) {
            setFolderOpen(lastNestling.folder_id, true);
          }
        }
      } else {
        navigate("/dashboard");
      }
    };

    restoreSession();
  }, [
    user,
    loading,
    location.pathname,
    navigate,
    setActiveNestId,
    setActiveNestling,
    setFolderOpen,
  ]);

  return null;
}
