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
import {
  useMindmapActions,
  useMindmapEdges,
  useMindmapNodes,
} from "@/stores/useMindmapStore";
import {
  useActiveNestling,
  useNestlingActions,
} from "@/stores/useNestlingStore";
import { toast } from "sonner";
import Toolbar from "./Toolbar";
import { getRandomElement } from "@/lib/utils/general";
import { COLORS } from "@/lib/utils/constants";
import useAutoSave from "@/hooks/useAutoSave";
import NestlingTitle from "../NestlingTitle";

const nodeTypes = {
  custom: CustomNode,
};

function MindmapEditorContent() {
  const {
    setNodes,
    setEdges,
    createNode,
    getNodes,
    updateNode,
    createEdge,
    getEdges,
    deleteEdge,
    deleteNode,
  } = useMindmapActions();
  const nodes = useMindmapNodes();
  const edges = useMindmapEdges();

  const { screenToFlowPosition } = useReactFlow();

  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const { updateNestling } = useNestlingActions();
  const [title, setTitle] = useState(activeNestling.title);

  const nestlingData = useMemo(() => ({ title }), [title]);
  useAutoSave(activeNestling.id!, nestlingData, updateNestling);

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
            createEdge({
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
    [nodes, edges, setEdges, deleteNode, createEdge],
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
        await createEdge({
          source: params.source,
          target: params.target,
        });
      } catch (error) {
        setEdges(edges);
        console.error("Failed to create edge:", error);
        toast.error("Failed to create edge");
      }
    },
    [edges, setEdges, createEdge],
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

        const newNode = await createNode({
          nestlingId: activeNestling.id!,
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
          await createEdge({
            source: connectionState.fromNode.id,
            target: newNode.id,
          });
        }
      }
    },
    [
      screenToFlowPosition,
      createNode,
      createEdge,
      nodes.length,
      activeNestling.id,
    ],
  );

  const handleCreateNode = async () => {
    try {
      await createNode({
        nestlingId: activeNestling.id!,
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
    if (!activeNestling.id) return;
    getNodes(activeNestling.id);
    getEdges(activeNestling.id);
  }, [activeNestling.id, getNodes, getEdges]);

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
          <Toolbar onAddNode={handleCreateNode} onDeleteAll={handleDeleteAll} />
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
