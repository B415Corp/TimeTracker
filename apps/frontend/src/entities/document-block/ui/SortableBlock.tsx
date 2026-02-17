import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { DocumentBlock, BlockType } from '@shared/types/document.types';
import { BlockRenderer } from './BlockRenderer';

interface SortableBlockProps {
  block: DocumentBlock;
  level?: number;
  isDropInside?: boolean;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onConvert?: (blockId: string, type: BlockType) => void;
  onIndent?: (blockId: string) => void;
  onOutdent?: (blockId: string) => void;
}

export const SortableBlock = ({ 
  block, 
  level = 0, 
  isDropInside = false,
  onUpdate, 
  onDelete, 
  onCreate, 
  onConvert,
  onIndent,
  onOutdent,
}: SortableBlockProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: block.block_id,
    data: { level, block } // Pass data for DnD logic
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-block-id={block.block_id}
      className={`relative group rounded-md ${isDropInside ? 'ring-2 ring-blue-400/70 bg-blue-50/40 dark:bg-blue-900/20' : ''}`}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </button>

      <BlockRenderer
        block={block}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onCreate={onCreate}
        onConvert={onConvert}
        onIndent={onIndent}
        onOutdent={onOutdent}
      />
    </div>
  );
};
