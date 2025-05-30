import { NoteLine } from "./note-line.types";

// flat -> tree
export function flatToTree(flat: NoteLine[]): any[] {
  console.log("🔧 flatToTree: входные данные:", flat);
  
  const idMap: Record<string, any> = {};
  const tree: any[] = [];
  
  // Сначала создаем мапу всех элементов
  flat.forEach(line => {
    idMap[line.id] = { ...line, children: [] };
  });
  
  console.log("🔧 flatToTree: idMap:", idMap);
  
  // Затем строим дерево
  flat.forEach(line => {
    if (line.parentId && idMap[line.parentId]) {
      idMap[line.parentId].children.push(idMap[line.id]);
    } else {
      tree.push(idMap[line.id]);
    }
  });
  
  console.log("🔧 flatToTree: результат дерева:", tree);
  return tree;
}

// tree -> flat
export function treeToFlat(tree: any[]): NoteLine[] {
  console.log("🔧 treeToFlat: входное дерево:", tree);
  
  const result: NoteLine[] = [];
  
  function walk(node: any, parentId: string | null, order: number) {
    const flatNode = {
      id: node.id,
      parentId,
      order,
      type: node.type,
      content: node.content,
      // Сохраняем все дополнительные свойства
      ...(node.checked !== undefined && { checked: node.checked }),
      ...(node.lang !== undefined && { lang: node.lang }),
    };
    
    result.push(flatNode);
    
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any, idx: number) => {
        walk(child, node.id, idx);
      });
    }
  }
  
  tree.forEach((node, idx) => walk(node, null, idx));
  
  console.log("🔧 treeToFlat: результат flat:", result);
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