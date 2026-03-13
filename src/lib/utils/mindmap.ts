export const getBestHandles = (
  sourcePos: { x: number; y: number },
  targetPos: { x: number; y: number },
): {
  sourceHandle: string;
  targetHandle: string;
} => {
  const dx = targetPos.x - sourcePos.x;
  const dy = targetPos.y - sourcePos.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0
      ? { sourceHandle: "right-source", targetHandle: "left-target" }
      : { sourceHandle: "left-source", targetHandle: "right-target" };
  } else {
    return dy > 0
      ? { sourceHandle: "bottom-source", targetHandle: "top-target" }
      : { sourceHandle: "top-source", targetHandle: "bottom-target" };
  }
};
