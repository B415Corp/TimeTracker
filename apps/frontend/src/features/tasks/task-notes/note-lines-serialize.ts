import { NoteLine } from "./note-line.types";

// flat -> tree
export function flatToTree(flat: NoteLine[]): any[] {
  const idMap: Record<string, any> = {};
  const tree: any[] = [];
  flat.forEach(line => {
    idMap[line.id] = { ...line, children: [] };
  });
  flat.forEach(line => {
    if (line.parentId && idMap[line.parentId]) {
      idMap[line.parentId].children.push(idMap[line.id]);
    } else {
      tree.push(idMap[line.id]);
    }
  });
  return tree;
}

// tree -> flat
export function treeToFlat(tree: any[]): NoteLine[] {
  const result: NoteLine[] = [];
  function walk(node: any, parentId: string | null, order: number[]) {
    result.push({
      id: node.id,
      parentId,
      order: order[order.length - 1],
      type: node.type,
      content: node.content,
    });
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any, idx: number) => {
        walk(child, node.id, [...order, idx]);
      });
    }
  }
  tree.forEach((node, idx) => walk(node, null, [idx]));
  return result;
}

// flat -> JSON
export function serializeNoteLines(flat: NoteLine[]): string {
  return JSON.stringify(flatToTree(flat));
}

// JSON -> flat
export function deserializeNoteLines(json: string): NoteLine[] {
  try {
    const tree = JSON.parse(json);
    return treeToFlat(tree);
  } catch {
    return [];
  }
} 