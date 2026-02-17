import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useGetBlocksByDocumentQuery, useCreateBlockMutation, useUpdateBlockMutation, useDeleteBlockMutation, useConvertBlockMutation, useReorderBlocksMutation } from '@shared/api/documentBlocksApi';
import { SortableBlock } from '@entities/document-block/ui/SortableBlock';
import { BlockType, DocumentBlock } from '@shared/types/document.types';
import { Button } from '@ui/button';
import { Plus } from 'lucide-react';
import { FloatingToolbar } from './FloatingToolbar';

interface DocumentEditorProps {
  documentId: string;
}

export const DocumentEditor = ({ documentId }: DocumentEditorProps) => {
  const { data: blocks = [], isLoading } = useGetBlocksByDocumentQuery(documentId);
  const [createBlock] = useCreateBlockMutation();
  const [updateBlock] = useUpdateBlockMutation();
  const [deleteBlock] = useDeleteBlockMutation();
  const [convertBlock] = useConvertBlockMutation();
  const [reorderBlocks] = useReorderBlocksMutation();
  const [lastCreatedBlockId, setLastCreatedBlockId] = useState<string | null>(null);
  const [localBlocks, setLocalBlocks] = useState<DocumentBlock[]>([]);

  // Sync blocks from server
  useEffect(() => {
    if (blocks.length > 0) {
      setLocalBlocks([...blocks]);
    }
  }, [blocks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Auto-focus new blocks
  useEffect(() => {
    if (lastCreatedBlockId) {
      const blockElement = document.querySelector(`[data-block-id="${lastCreatedBlockId}"]`);
      if (blockElement) {
        const editable = blockElement.querySelector('[contenteditable="true"]') as HTMLElement;
        if (editable) {
          editable.focus();
          setLastCreatedBlockId(null);
        }
      }
    }
  }, [blocks, lastCreatedBlockId]);

  // Arrow key navigation between blocks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

      const activeElement = document.activeElement as HTMLElement;
      if (!activeElement || !activeElement.contentEditable) return;

      // Find current block
      const currentBlock = activeElement.closest('[data-block-id]') as HTMLElement;
      if (!currentBlock) return;

      const currentBlockId = currentBlock.getAttribute('data-block-id');
      const currentIndex = blocks.findIndex((b) => b.block_id === currentBlockId);
      if (currentIndex === -1) return;

      // Get cursor position
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const cursorOffset = range.startOffset;
      const textContent = activeElement.textContent || '';

      if (e.key === 'ArrowUp') {
        // Only navigate if cursor is at the start
        if (cursorOffset === 0 && currentIndex > 0) {
          e.preventDefault();
          const prevBlock = document.querySelector(`[data-block-id="${blocks[currentIndex - 1].block_id}"]`);
          const prevEditable = prevBlock?.querySelector('[contenteditable="true"]') as HTMLElement;
          if (prevEditable) {
            prevEditable.focus();
            // Move cursor to end
            const textLength = prevEditable.textContent?.length || 0;
            const newRange = document.createRange();
            const textNode = prevEditable.childNodes[0];
            if (textNode) {
              newRange.setStart(textNode, Math.min(textLength, textNode.textContent?.length || 0));
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);
            }
          }
        }
      } else if (e.key === 'ArrowDown') {
        // Only navigate if cursor is at the end
        if (cursorOffset === textContent.length && currentIndex < blocks.length - 1) {
          e.preventDefault();
          const nextBlock = document.querySelector(`[data-block-id="${blocks[currentIndex + 1].block_id}"]`);
          const nextEditable = nextBlock?.querySelector('[contenteditable="true"]') as HTMLElement;
          if (nextEditable) {
            nextEditable.focus();
            // Move cursor to start
            const newRange = document.createRange();
            const textNode = nextEditable.childNodes[0];
            if (textNode) {
              newRange.setStart(textNode, 0);
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [blocks]);

  const handleUpdateBlock = async (blockId: string, content: any) => {
    try {
      await updateBlock({ blockId, content }).unwrap();
    } catch (error) {
      console.error('Failed to update block:', error);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      await deleteBlock(blockId).unwrap();
    } catch (error) {
      console.error('Failed to delete block:', error);
    }
  };

  const handleCreateBlock = async (afterBlockId?: string) => {
    try {
      const afterBlock = blocks.find((b) => b.block_id === afterBlockId);
      const newOrder = afterBlock ? afterBlock.order + 1 : blocks.length;

      const result = await createBlock({
        documentId,
        type: BlockType.PARAGRAPH,
        content: { text: '' },
        order: newOrder,
      }).unwrap();
      
      setLastCreatedBlockId(result.block_id);
    } catch (error) {
      console.error('Failed to create block:', error);
    }
  };

  const handleConvertBlock = async (blockId: string, newType: BlockType) => {
    try {
      await convertBlock({ blockId, type: newType }).unwrap();
    } catch (error) {
      console.error('Failed to convert block:', error);
    }
  };

  const handleAddBlock = () => {
    handleCreateBlock();
  };

  const handleFormat = (format: 'bold' | 'italic' | 'underline' | 'link', value?: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    if (format === 'link') {
      if (!value) return;
      
      // Create link
      const range = selection.getRangeAt(0);
      const link = document.createElement('a');
      link.href = value;
      link.className = 'text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      try {
        range.surroundContents(link);
      } catch {
        // If range spans multiple elements, use different approach
        link.textContent = range.toString();
        range.deleteContents();
        range.insertNode(link);
      }
      
      // Trigger input event to save
      const element = link.closest('[contenteditable="true"]');
      if (element) {
        element.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } else {
      // Apply formatting
      const tag = format === 'bold' ? 'strong' : format === 'italic' ? 'em' : 'u';
      const range = selection.getRangeAt(0);
      const wrapper = document.createElement(tag);
      
      try {
        range.surroundContents(wrapper);
      } catch {
        wrapper.textContent = range.toString();
        range.deleteContents();
        range.insertNode(wrapper);
      }
      
      // Trigger input event to save
      const element = wrapper.closest('[contenteditable="true"]');
      if (element) {
        element.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = localBlocks.findIndex((b) => b.block_id === active.id);
    const newIndex = localBlocks.findIndex((b) => b.block_id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistically update local state
    const reorderedBlocks = arrayMove(localBlocks, oldIndex, newIndex);
    setLocalBlocks(reorderedBlocks);

    // Update order numbers and send to backend
    const blockUpdates = reorderedBlocks.map((block, index) => ({
      block_id: block.block_id,
      order: index,
    }));

    try {
      await reorderBlocks({ documentId, blocks: blockUpdates }).unwrap();
    } catch (error) {
      console.error('Failed to reorder blocks:', error);
      // Revert on error
      setLocalBlocks([...blocks]);
    }
  };

  if (isLoading) {
    return <div className="py-8 text-center text-gray-500">Loading...</div>;
  }

  const blocksToRender = localBlocks.length > 0 ? localBlocks : blocks;

  return (
    <>
      <FloatingToolbar onFormat={handleFormat} />
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="pl-6">
        <SortableContext
          items={blocksToRender.map((b) => b.block_id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-0.5">
            {blocksToRender.map((block) => (
              <SortableBlock
                key={block.block_id}
                block={block}
                onUpdate={handleUpdateBlock}
                onDelete={handleDeleteBlock}
                onCreate={handleCreateBlock}
                onConvert={handleConvertBlock}
              />
            ))}
          </div>
        </SortableContext>

        {blocksToRender.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Start writing or type '/' for commands</p>
            <Button onClick={handleAddBlock} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add first block
            </Button>
          </div>
        )}

        {blocksToRender.length > 0 && (
          <button
            onClick={handleAddBlock}
            className="w-full py-3 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-2 px-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
            Click to add block, or type '/' for commands
          </button>
        )}
        </div>
      </DndContext>
    </>
  );
};
