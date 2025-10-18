import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge as reactFlowAddEdge,
  NodeChange,
  EdgeChange,
  Background,
  Connection,
  OnConnectEnd,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";
import { MindmapNode, MindmapEdge } from "@/lib/types/mindmap";
import { useMindmapStore } from "@/stores/useMindmapStore";
import useActiveNestling from "@/hooks/useActiveNestling";
import { toast } from "sonner";
import Toolbar from "./Toolbar";

const nodeTypes = {
  custom: CustomNode,
};

function MindmapEditorContent() {
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
    deleteNode,
  } = useMindmapStore();
  const { screenToFlowPosition } = useReactFlow();

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

  const onConnectEnd: OnConnectEnd = useCallback(
    async (event, connectionState) => {
      if (!connectionState.isValid) {
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;

        const position = screenToFlowPosition({
          x: clientX,
          y: clientY,
        });

        const newNode = await addNode({
          nestling_id: activeNestlingId!,
          position,
          height: 50,
          width: 120,
          data: {
            label: `Node ${nodes.length + 1}`,
            color: "#ffffff",
            text_color: "#000000",
          },
          type: "custom",
        });

        if (connectionState.fromNode) {
          await addEdge({
            source: connectionState.fromNode.id,
            target: newNode.id,
          });
        }
      }
    },
    [screenToFlowPosition, addNode, addEdge, nodes.length, activeNestlingId],
  );

  const handleAddNode = async () => {
    try {
      await addNode({
        nestling_id: activeNestlingId!,
        position: {
          x: Math.random() * 300,
          y: Math.random() * 300,
        },
        height: 50,
        width: 120,
        data: {
          label: `New Node ${nodes.length + 1}`,
          color: "#ffffff",
          text_color: "#000000",
        },
        type: "custom",
      });
    } catch (error) {
      toast.error("Failed to add node");
      console.error("Failed to add node:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await Promise.all(nodes.map((node) => deleteNode(parseInt(node.id))));
    } catch (error) {
      toast.error("Failed to delete all");
      console.error("Failed to delete all:", error);
    }
  };

  useEffect(() => {
    fetchNodes(activeNestlingId!);
    fetchEdges(activeNestlingId!);
  }, [activeNestlingId, fetchNodes, fetchEdges]);

  return (
    <div className="h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onConnectEnd={onConnectEnd}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeOrigin={[0.5, 0]}
        fitView
      >
        <Background />
        <Toolbar onAddNode={handleAddNode} onDeleteAll={handleDeleteAll} />
      </ReactFlow>
    </div>
  );
}

export default function MindmapEditor() {
  return (
    <ReactFlowProvider>
      <MindmapEditorContent />
    </ReactFlowProvider>
  );
}
