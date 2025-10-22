export type DragType = "column" | "card";

export type ParsedDragId = {
  type: DragType;
  id: number;
  columnId?: number;
};

export function parseDragId(dragId: string | number): ParsedDragId | null {
  const parts = dragId.toString().split("-");
  const type = parts[0] as DragType;

  if (type === "column") {
    // column-colId
    return { type, id: Number(parts[1]) };
  } else if (type === "card") {
    // card-cardId-column-colId
    return { type, id: Number(parts[1]), columnId: Number(parts[3]) };
  }

  return null;
}

export function reorderArray<T>(
  arr: T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  const newArray = [...arr];
  const [movedItems] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, movedItems);
  return newArray;
}

export function updateOrderIndexes<T extends { order_index: number }>(
  items: T[],
) {
  return items.map((item, index) => ({ ...item, order_index: index }));
}
