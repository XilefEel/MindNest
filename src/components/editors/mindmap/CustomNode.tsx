import MindmapContextMenu from "@/components/context-menu/MindmapContextMenu";
import { useMindmapActions, useMindmapNodes } from "@/stores/useMindmapStore";
import { Handle, Position, NodeResizer } from "@xyflow/react";
import { useState } from "react";

export default function ResizableNodeSelected({
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
        data: {
          ...currentNode.data,
          label,
        },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      setLabel(data.label);
      e.currentTarget.blur();
    }
  };

  return (
    <MindmapContextMenu node={currentNode}>
      <div
        className="h-full rounded border border-gray-200 p-3"
        style={{
          backgroundColor: data.color,
        }}
      >
        <NodeResizer
          color="#ff0071"
          isVisible={selected}
          minWidth={120}
          minHeight={50}
        />
        <Handle type="target" position={Position.Top} />
        <input
          id="text"
          className="w-full text-center text-sm focus:outline-none"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        <Handle type="source" position={Position.Bottom} />
      </div>
    </MindmapContextMenu>
  );
}
