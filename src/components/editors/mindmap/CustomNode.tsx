import MindmapContextMenu from "@/components/context-menu/MindmapContextMenu";
import { useMindmapActions, useMindmapNodes } from "@/stores/useMindmapStore";
import { Handle, NodeResizer, Position, useReactFlow } from "@xyflow/react";
import { useState, useRef, useEffect } from "react";

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
  const { setNodes } = useReactFlow();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    resetHeight();
  }, []);

  const currentNode = nodes.find((n) => n.id === id);
  if (!currentNode) return;

  const resetHeight = () => {
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
          textareaRef.current.scrollHeight + "px";
      }
    }, 0);
  };

  const handleBlur = async () => {
    if (label !== data.label) {
      await updateNode(id, {
        data: { ...currentNode.data, label },
      });
    }

    resetHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
      setLabel(data.label);
      setNodes((nodes) => nodes.map((n) => ({ ...n, selected: false })));

      resetHeight();
    }
  };

  return (
    <MindmapContextMenu node={currentNode}>
      <div
        className="flex h-full w-full items-center justify-center rounded border border-gray-200 p-3"
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

        <textarea
          ref={textareaRef}
          rows={1}
          onChange={(e) => {
            setLabel(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          value={label}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full resize-none bg-transparent text-center text-sm focus:outline-none"
        />
      </div>
    </MindmapContextMenu>
  );
}
