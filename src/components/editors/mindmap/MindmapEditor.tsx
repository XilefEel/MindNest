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

const initialNodes = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

export default function MindmapEditor() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [nodeCount, setNodeCount] = useState(2);

  const onNodesChange = useCallback(
    (
      changes: NodeChange<{
        id: string;
        position: { x: number; y: number };
        data: { label: string };
      }>[],
    ) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
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
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      data: { label: `Node ${nodeCount + 1}` },
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
