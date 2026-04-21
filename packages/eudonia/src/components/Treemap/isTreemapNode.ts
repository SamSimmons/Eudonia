import type { TreemapNode } from "./types";

export function isTreemapNode(data: unknown): data is TreemapNode {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "name" in data &&
    typeof data.name === "string"
  );
}
