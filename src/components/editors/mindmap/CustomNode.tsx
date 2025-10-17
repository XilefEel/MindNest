import { Handle, Position, NodeResizer } from "@xyflow/react";

export default function ResizableNodeSelected({
  data,
  selected,
}: {
  data: any;
  selected: any;
}) {
  return (
    <div className="h-full rounded border bg-white p-3">
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <Handle type="target" position={Position.Top} />
      <input
        id="text"
        name={data.label}
        className="w-full text-center focus:outline-none"
      />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
