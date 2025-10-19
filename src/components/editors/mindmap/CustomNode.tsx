import MindmapContextMenu from "@/components/context-menu/MindmapContextMenu";
import { useMindmapStore } from "@/stores/useMindmapStore";
import { Handle, Position, NodeResizer } from "@xyflow/react";
import { useState } from "react";

export default function ResizableNodeSelected({
  data,
  selected,
  id,
}: {
  data: { label: string; color: string; textColor: string };
  selected: any;
  id: string;
}) {
  const [label, setLabel] = useState(data.label);
  const { updateNode, nodes } = useMindmapStore();

  const handleBlur = async () => {
    if (label !== data.label) {
      const currentNode = nodes.find((n) => n.id === id);
      if (!currentNode) return;

      await updateNode(parseInt(id), {
        nestling_id: currentNode.nestling_id,
        position: currentNode.position,
        height: currentNode.height,
        width: currentNode.width,
        type: currentNode.type,
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
    <MindmapContextMenu>
      <div className="h-full rounded border border-gray-200 bg-white p-3">
        <NodeResizer
          color="#ff0071"
          isVisible={selected}
          minWidth={120}
          minHeight={50}
        />
        <Handle type="target" position={Position.Top} />
        <input
          id="text"
          className="w-full text-center text-sm text-black focus:outline-none"
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
