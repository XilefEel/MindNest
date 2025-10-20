import { COLORS } from "@/lib/utils/constants";
import * as ContextMenu from "@radix-ui/react-context-menu";
import {
  Trash,
  Palette,
  Type,
  CirclePlus,
  CornerDownRight,
  Check,
  CornerUpLeft,
} from "lucide-react";
import ContextMenuItem from "./ContextMenuItem";
import BaseContextMenu from "./BaseContextMenu";
import { MindmapNode } from "@/lib/types/mindmap";
import { useMindmapStore } from "@/stores/useMindmapStore";
import { getRandomElement } from "@/lib/utils/general";

export default function MindmapContextMenu({
  children,
  node,
}: {
  children: React.ReactNode;
  node: MindmapNode;
}) {
  const { nodes, edges, addNode, addEdge, updateNode, deleteNode } =
    useMindmapStore();

  const handleEditNode = async (color: string, text?: boolean) => {
    try {
      if (text) {
        await updateNode(parseInt(node.id), {
          ...node,
          data: {
            ...node.data,
            text_color: color,
          },
        });
      } else {
        await updateNode(parseInt(node.id), {
          ...node,
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
      const newNode = await addNode({
        nestling_id: node.nestling_id,
        position: {
          x: currentNode.position.x + Math.random() * 300,
          y: currentNode.position.y + Math.random() * 300,
        },
        height: 50,
        width: 120,
        data: {
          label: `Node ${nodes.length + 1}`,
          color: getRandomElement(COLORS),
          text_color: "#000000",
        },
        type: "custom",
      });

      await addEdge({
        source: currentNode.id,
        target: newNode.id,
      });
    } catch (error) {
      console.error("Failed to add node:", error);
    }
  };

  const handleAddParent = async () => {
    try {
      const newParentNode = await addNode({
        nestling_id: node.nestling_id,
        position: {
          x: node.position.x + Math.random() * 300,
          y: node.position.y - Math.random() * 300,
        },
        height: 50,
        width: 120,
        data: {
          label: `Node ${nodes.length + 1}`,
          color: getRandomElement(COLORS),
          text_color: "#000000",
        },
        type: "custom",
      });

      await addEdge({
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

          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors duration-200 outline-none hover:bg-gray-100 data-[state=open]:bg-gray-100 dark:hover:bg-gray-700 dark:data-[state=open]:bg-gray-700">
              <Palette className="h-4 w-4" />
              <span>Change Color</span>
              <div
                className="ml-auto h-3 w-3 rounded-full border border-gray-300 dark:border-gray-600"
                style={{
                  backgroundColor: node.data.color,
                }}
              />
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent className="animate-in fade-in-0 zoom-in-95 z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      className="relative h-8 w-8 rounded-full border-2 border-gray-200 transition-all duration-200 hover:scale-110 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                      title={color}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditNode(color);
                      }}
                    >
                      {node.data.color === color && (
                        <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>

          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className="mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm transition-colors duration-200 outline-none hover:bg-gray-100 data-[state=open]:bg-gray-100 dark:hover:bg-gray-700 dark:data-[state=open]:bg-gray-700">
              <Type className="h-4 w-4" />
              <span>Change Text Color</span>
              <div
                className="ml-auto h-3 w-3 rounded-full border border-gray-300 dark:border-gray-600"
                style={{
                  backgroundColor: node.data.text_color,
                }}
              />
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent className="animate-in fade-in-0 zoom-in-95 z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      className="relative h-8 w-8 rounded-full border-2 border-gray-200 transition-all duration-200 hover:scale-110 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                      title={color}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditNode(color, true);
                      }}
                    >
                      {node.data.text_color === color && (
                        <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>

          <ContextMenu.Separator className="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-700" />

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
