import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge as reactFlowAddEdge,
  NodeChange,
  EdgeChange,
  Controls,
  Background,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";
import { MindmapNode, MindmapEdge } from "@/lib/types/mindmap";
import { useMindmapStore } from "@/stores/useMindmapStore";
import useActiveNestling from "@/hooks/useActiveNestling";

const nodeTypes = {
  Custom: CustomNode,
};

export default function MindmapEditor() {
  const { activeNestlingId } = useActiveNestling();
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    addNode,
    fetchNodes,
    updateNode,
    addEdge,
    fetchEdges,
    deleteEdge,
  } = useMindmapStore();

  const onNodesChange = useCallback(
    (changes: NodeChange<MindmapNode>[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);

      changes.forEach((change) => {
        if (
          change.type === "position" &&
          change.dragging === false &&
          change.position
        ) {
          const node = nodes.find((n) => n.id === change.id);
          if (node) {
            updateNode(parseInt(node.id), {
              ...node,
              position: change.position,
            });
          }
        }
      });
    },
    [nodes, updateNode],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<MindmapEdge>[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      setEdges(updatedEdges);

      changes.forEach((change) => {
        if (change.type === "remove") deleteEdge(parseInt(change.id));
      });
    },
    [edges, setEdges, deleteEdge],
  );

  const onConnect = useCallback(
    async (params: Connection) => {
      const newEdge = reactFlowAddEdge(params, edges);
      setEdges(newEdge);

      try {
        await addEdge({
          source: params.source,
          target: params.target,
        });
      } catch (error) {
        setEdges(edges);
        console.error("Failed to create edge:", error);
      }
    },
    [edges, setEdges, addEdge, activeNestlingId!],
  );

  // Add new node
  const handleAddNode = useCallback(async () => {
    await addNode({
      nestling_id: activeNestlingId!,
      position: {
        x: Math.random() * 300,
        y: Math.random() * 300,
      },
      height: 100,
      width: 200,
      data: {
        label: `New Node ${nodes.length + 1}`,
        color: "#ffffff",
        text_color: "#000000",
      },
      node_type: "Custom",
    });
  }, [addNode, nodes.length, activeNestlingId!]);

  useEffect(() => {
    fetchNodes(activeNestlingId!);
    fetchEdges(activeNestlingId!);
  }, [activeNestlingId, fetchNodes, fetchEdges]);

  return (
    <div className="h-full">
      <button
        onClick={handleAddNode}
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
