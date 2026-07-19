import useAutoSave from "@/hooks/useAutoSave";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import { useState, useMemo, useEffect } from "react";
import NestlingTitle from "../NestlingTitle";
import { useDbActions, useDbViewMode } from "@/stores/useDatabaseStore";
import DatabaseToolbar from "./DatabaseToolbar";
import DatabaseBoardView from "./DatabaseBoardView";
import DatabaseTableView from "./DatabaseTableView";

export default function DatabaseEditor() {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return null;

  const { updateNestling } = useNestlingActions();
  const [title, setTitle] = useState(activeNestling.title);
  const nestlingData = useMemo(() => ({ title }), [title]);
  useAutoSave(activeNestling.id!, nestlingData, updateNestling);

  const viewMode = useDbViewMode();
  const { getDbData } = useDbActions();

  useEffect(() => {
    getDbData(activeNestling.id!);
  }, [activeNestling.id]);

  return (
    <div className="flex flex-col gap-4">
      <NestlingTitle
        title={title}
        setTitle={setTitle}
        nestling={activeNestling}
      />

      <div>
        <DatabaseToolbar />
        {viewMode === "table" ? <DatabaseTableView /> : <DatabaseBoardView />}
      </div>
    </div>
  );
}
