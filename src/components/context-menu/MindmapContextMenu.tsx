import { COLORS } from "@/lib/utils/constants";
import {
  Trash,
  CirclePlus,
  CornerDownRight,
  CornerUpLeft,
  Type,
} from "lucide-react";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import { MindmapNode } from "@/lib/types/mindmap";
import {
  useMindmapActions,
  useMindmapEdges,
  useMindmapNodes,
} from "@/stores/useMindmapStore";
import { getRandomElement } from "@/lib/utils/general";
import ColorPickerMenu from "./ColorPickerMenu";
import ContextMenuSeparator from "./ContextMenuSeparator";

export default function MindmapContextMenu({
  children,
  node,
}: {
  children: React.ReactNode;
  node: MindmapNode;
}) {
  const { createNode, createEdge, updateNode, deleteNode } =
    useMindmapActions();
  const nodes = useMindmapNodes();
  const edges = useMindmapEdges();

  const handleEditNode = async (color: string, text?: boolean) => {
    try {
      if (text) {
        await updateNode(parseInt(node.id), {
          data: {
            ...node.data,
            textColor: color,
          },
        });
      } else {
        await updateNode(parseInt(node.id), {
          data: {
            ...node.data,
            color,
          },
        });
      }
    } catch (error) {
      console.error("Failed to update node:", error);
    }
  };

  const handleDeleteNode = async () => {
    try {
      await deleteNode(parseInt(node.id));
    } catch (error) {}
  };

  const handleAddChild = async (currentNode: MindmapNode) => {
    try {
      const newNode = await createNode({
        nestlingId: node.nestlingId,
        position: {
          x: currentNode.position.x + Math.random() * 300,
          y: currentNode.position.y + Math.random() * 300,
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

      await createEdge({
        source: currentNode.id,
        target: newNode.id,
      });
    } catch (error) {
      console.error("Failed to add node:", error);
    }
  };

  const handleAddParent = async () => {
    try {
      const newParentNode = await createNode({
        nestlingId: node.nestlingId,
        position: {
          x: node.position.x + Math.random() * 300,
          y: node.position.y - Math.random() * 300,
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

      await createEdge({
        source: newParentNode.id,
        target: node.id,
      });
    } catch (error) {}
  };

  const handleAddSibling = async () => {
    try {
      const parentEdge = edges.find((edge) => edge.target === node.id);
      if (parentEdge) {
        const parentNode = nodes.find((n) => n.id === parentEdge.source);
        if (parentNode) {
          await handleAddChild(parentNode);
        } else {
          console.error("Parent node not found");
        }
      }
    } catch (error) {
      console.error("Failed to add node:", error);
    }
  };

  return (
    <BaseContextMenu
      content={
        <>
          <ContextMenuItem
            Icon={CirclePlus}
            text="Add Child Node"
            action={() => handleAddChild(node)}
          />

          <ContextMenuItem
            Icon={CornerUpLeft}
            text="Add Parent Node"
            action={handleAddParent}
          />

          <ContextMenuItem
            Icon={CornerDownRight}
            text="Add Sibling Node"
            action={handleAddSibling}
          />

          <ColorPickerMenu
            element={node.data}
            handleChangeColor={handleEditNode}
            label="Change Node Color"
          />

          <ColorPickerMenu
            element={{ color: node.data.textColor }}
            handleChangeColor={(color) => handleEditNode(color, true)}
            label="Change Text Color"
            Icon={Type}
          />

          <ContextMenuSeparator />

          <ContextMenuItem
            Icon={Trash}
            text="Delete Node"
            action={handleDeleteNode}
            isDelete
          />
        </>
      }
    >
      {children}
    </BaseContextMenu>
  );
}
