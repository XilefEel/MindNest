import MindmapContextMenu from "@/components/context-menu/MindmapContextMenu";
import { useMindmapActions, useMindmapNodes } from "@/stores/useMindmapStore";
import { Handle, NodeResizer, Position } from "@xyflow/react";
import { useState } from "react";

const HANDLE_POSITIONS = [
  { position: Position.Top, posId: "top" },
  { position: Position.Bottom, posId: "bottom" },
  { position: Position.Left, posId: "left" },
  { position: Position.Right, posId: "right" },
];

export default function CustomNode({
  data,
  selected,
  id,
}: {
  data: { label: string; color: string };
  selected: any;
  id: string;
}) {
  const [label, setLabel] = useState(data.label);
  const nodes = useMindmapNodes();
  const { updateNode } = useMindmapActions();
  const currentNode = nodes.find((n) => n.id === id);
  if (!currentNode) return;

  const handleBlur = async () => {
    if (label !== data.label) {
      await updateNode(id, {
        data: { ...currentNode.data, label },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur();
    if (e.key === "Escape") {
      setLabel(data.label);
      e.currentTarget.blur();
    }
  };

  return (
    <MindmapContextMenu node={currentNode}>
      <div
        className="h-full rounded border border-gray-200 p-3"
        style={{ backgroundColor: data.color }}
      >
        <NodeResizer
          color="#ff0071"
          isVisible={selected}
          minWidth={120}
          minHeight={50}
        />

        {HANDLE_POSITIONS.map(({ position, posId }) => (
          <>
            <Handle
              id={`${posId}-target`}
              key={`${posId}-target`}
              type="target"
              position={position}
              style={{ zIndex: 1 }}
            />
            <Handle
              id={`${posId}-source`}
              key={`${posId}-source`}
              type="source"
              position={position}
              style={{ zIndex: 2 }}
            />
          </>
        ))}

        <input
          id="text"
          className="w-full text-center text-sm focus:outline-none"
          style={{ backgroundColor: "transparent" }}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      </div>
    </MindmapContextMenu>
  );
}
