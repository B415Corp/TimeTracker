import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { DocumentBlock, BlockType } from '@shared/types/document.types';
import { BlockRenderer } from './BlockRenderer';

interface SortableBlockProps {
  block: DocumentBlock;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onConvert?: (blockId: string, type: BlockType) => void;
}

export const SortableBlock = ({ block, onUpdate, onDelete, onCreate, onConvert }: SortableBlockProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.block_id });

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
      className="relative group"
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
      />
    </div>
  );
};
