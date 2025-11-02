import { useCallback, useEffect, useMemo, useState } from "react";
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
  getIncomers,
  getOutgoers,
  getConnectedEdges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";
import { MindmapNode, MindmapEdge } from "@/lib/types/mindmap";
import { useMindmapStore } from "@/stores/useMindmapStore";
import useActiveNestling from "@/hooks/useActiveNestling";
import { toast } from "sonner";
import Toolbar from "./Toolbar";
import { getRandomElement } from "@/lib/utils/general";
import { COLORS } from "@/lib/utils/constants";
import { useNestlingStore } from "@/stores/useNestlingStore";
import useAutoSave from "@/hooks/useAutoSave";
import NestlingTitle from "../NestlingTitle";

const nodeTypes = {
  custom: CustomNode,
};

function MindmapEditorContent() {
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

  const { activeNestling, activeNestlingId } = useActiveNestling();
  const { updateNestling } = useNestlingStore();
  if (!activeNestling) return;
  const [title, setTitle] = useState(activeNestling.title);

  useAutoSave({
    target: activeNestling,
    currentData: useMemo(
      () => ({
        title,
        folderId: activeNestling.folderId ?? null,
      }),
      [activeNestling.folderId, title],
    ),

    saveFunction: (id, data) => updateNestling(id, data),
  });

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
        if (
          change.type === "dimensions" &&
          change.resizing === false &&
          change.dimensions
        ) {
          const node = nodes.find((n) => n.id === change.id);
          if (node) {
            updateNode(parseInt(node.id), {
              ...node,
              position: node.position,
              width: change.dimensions.width,
              height: change.dimensions.height,
            });
          }
        }
        if (change.type === "remove") deleteNode(parseInt(change.id));
      });
    },
    [nodes, updateNode, setNodes, deleteNode],
  );

  const onNodeDelete = useCallback(
    async (deletedNodes: MindmapNode[]) => {
      let remainingNodes = [...nodes];

      const newEdges = deletedNodes.reduce((currentEdges, node) => {
        const incomers = getIncomers(node, remainingNodes, currentEdges);
        const outgoers = getOutgoers(node, remainingNodes, currentEdges);
        const connectedEdges = getConnectedEdges([node], currentEdges);

        const remainingEdges = currentEdges.filter(
          (edge) => !connectedEdges.includes(edge),
        );

        const createdEdges = incomers
          .flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}-${target}`,
              source,
              target,
            })),
          )
          .filter(
            (newEdge) =>
              !currentEdges.some(
                (existingEdge) =>
                  existingEdge.source === newEdge.source &&
                  existingEdge.target === newEdge.target,
              ),
          ) as MindmapEdge[];

        remainingNodes = remainingNodes.filter((r) => r.id !== node.id);
        return [...remainingEdges, ...createdEdges];
      }, edges);

      setEdges(newEdges);

      try {
        await Promise.all(
          deletedNodes.map((node) => deleteNode(parseInt(node.id))),
        );

        const edgesToCreate = newEdges.filter(
          (edge) => !edges.some((e) => e.id === edge.id),
        );

        await Promise.all(
          edgesToCreate.map((edge) =>
            addEdge({
              source: edge.source,
              target: edge.target,
            }),
          ),
        );
      } catch (error) {
        console.error("Failed to delete node:", error);
        toast.error("Failed to delete node");
      }
    },
    [nodes, edges, setEdges, deleteNode, addEdge],
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
        toast.error("Failed to create edge");
      }
    },
    [edges, setEdges, addEdge],
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
          nestlingId: activeNestlingId!,
          position,
          height: 50,
          width: 120,
          data: {
            label: `Node ${nodes.length + 1}`,
            color: getRandomElement(COLORS),
            textColor: "#000000",
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
        nestlingId: activeNestlingId!,
        position: {
          x: Math.random() * 300,
          y: Math.random() * 300,
        },
        height: 50,
        width: 120,
        data: {
          label: `Node ${nodes.length + 1}`,
          color: getRandomElement(COLORS),
          textColor: "#000000",
        },
        type: "custom",
      });
    } catch (error) {
      toast.error("Failed to add node");
      console.error("Failed to add node:", error);
    }
  };

  const handleDeleteAll = async () => {
    if (nodes.length === 0) return;

    try {
      await Promise.all(nodes.map((node) => deleteNode(parseInt(node.id))));
      toast.success("All nodes deleted");
    } catch (error) {
      toast.error("Failed to delete all");
      console.error("Failed to delete all:", error);
    }
  };

  useEffect(() => {
    if (!activeNestlingId) return;
    fetchNodes(activeNestlingId);
    fetchEdges(activeNestlingId);
  }, [activeNestlingId, fetchNodes, fetchEdges]);

  return (
    <>
      <NestlingTitle
        title={title}
        setTitle={setTitle}
        nestling={activeNestling}
      />
      <div className="h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          nodeOrigin={[0.5, 0]}
          onNodesChange={onNodesChange}
          onNodesDelete={onNodeDelete}
          onConnectEnd={onConnectEnd}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          defaultEdgeOptions={{ markerEnd: { type: "arrowclosed" } }}
          fitView
        >
          <Background />
          <Toolbar onAddNode={handleAddNode} onDeleteAll={handleDeleteAll} />
        </ReactFlow>
      </div>
    </>
  );
}

export default function MindmapEditor() {
  return (
    <ReactFlowProvider>
      <MindmapEditorContent />
    </ReactFlowProvider>
  );
}
