import { DocumentBlock, BlockType } from '@shared/types/document.types';
import { SortableBlock } from './SortableBlock';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface BlockTreeProps {
  blocks: DocumentBlock[];
  parentId?: string | null;
  level?: number;
  dropOverId?: string | null;
  dropPosition?: 'before' | 'inside' | null;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onConvert?: (blockId: string, type: BlockType) => void;
  onIndent?: (blockId: string) => void;
  onOutdent?: (blockId: string) => void;
}

export const BlockTree = ({
  blocks,
  parentId = null,
  level = 0,
  dropOverId = null,
  dropPosition = null,
  onUpdate,
  onDelete,
  onCreate,
  onConvert,
  onIndent,
  onOutdent,
}: BlockTreeProps) => {
  // Get children of current parent, sorted by order
  const children = blocks
    .filter((b) => b.parent_block_id === parentId)
    .sort((a, b) => a.order - b.order);

  if (children.length === 0) {
    return null;
  }

  const childIds = children.map((b) => b.block_id);

  return (
    <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
      <div style={{ marginLeft: level > 0 ? `${level * 12}px` : 0 }}>
        {children.map((block) => (
          <div key={block.block_id} className="relative">
            {dropOverId === block.block_id && dropPosition === 'before' && (
              <div className="h-0.5 bg-blue-500 rounded my-1 ml-1 mr-2" />
            )}
            <SortableBlock
              block={block}
              level={level}
              isDropInside={dropOverId === block.block_id && dropPosition === 'inside'}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onCreate={onCreate}
              onConvert={onConvert}
              onIndent={onIndent}
              onOutdent={onOutdent}
            />

            {/* Рекурсивно рендерим детей */}
            <BlockTree
              blocks={blocks}
              parentId={block.block_id}
              level={level + 1}
              dropOverId={dropOverId}
              dropPosition={dropPosition}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onCreate={onCreate}
              onConvert={onConvert}
              onIndent={onIndent}
              onOutdent={onOutdent}
            />
          </div>
        ))}
      </div>
    </SortableContext>
  );
};
