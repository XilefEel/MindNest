import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeChange,
  EdgeChange,
  Controls,
  Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";
import { MindmapNode } from "@/lib/types/mindmap";

const initialNodes: MindmapNode[] = [
  {
    id: "1",
    nestling_id: 1,
    position: { x: 0, y: 0 },
    type: "Custom",
    data: {
      label: "Node 1",
      color: "#ff0071",
      textColor: "#ffffff",
    },
    height: 100,
    width: 255,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    nestling_id: 1,
    position: { x: 100, y: 100 },
    type: "Custom",
    data: {
      label: "Node 1",
      color: "#ff0071",
      textColor: "#ffffff",
    },
    height: 100,
    width: 255,
    created_at: "",
    updated_at: "",
  },
];
const initialEdges = [{ id: "1-2", source: "1", target: "2" }];

const nodeTypes = {
  Custom: CustomNode,
};

export default function MindmapEditor() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [nodeCount, setNodeCount] = useState(2);

  const onNodesChange = useCallback(
    (changes: NodeChange<MindmapNode>[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<{ id: string; source: string; target: string }>[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const addNode = useCallback(() => {
    const newId = `n${nodeCount + 1}`;
    const newNode = {
      id: newId,
      type: "Custom",
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      height: 100,
      width: 255,
      data: {
        label: `Node ${nodeCount + 1}`,
        color: "#ff0071",
        textColor: "#ffffff",
      },
      nestling_id: 1,
      created_at: "",
      updated_at: "",
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    setNodeCount((prev) => prev + 1);
  }, [nodeCount]);

  return (
    <div className="h-full">
      <button
        onClick={addNode}
        className="absolute top-2.5 left-2.5 z-10 rounded bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-teal-600"
      >
        Add Node
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
