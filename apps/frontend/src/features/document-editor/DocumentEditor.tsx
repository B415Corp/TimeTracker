import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useGetBlocksByDocumentQuery, useCreateBlockMutation, useUpdateBlockMutation, useDeleteBlockMutation, useConvertBlockMutation } from '../../shared/api/documentBlocksApi';
import { BlockTree } from '../../entities/document-block/ui/BlockTree';
import { BlockType, DocumentBlock } from '../../shared/types/document.types';
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
  const [lastCreatedBlockId, setLastCreatedBlockId] = useState<string | null>(null);
  const [localBlocks, setLocalBlocks] = useState<DocumentBlock[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'inside' | null>(null);

  // Sync blocks from server
  useEffect(() => {
    // Do not overwrite local optimistic DnD state during active drag
    if (!activeId) {
      setLocalBlocks([...blocks]);
    }
  }, [blocks, activeId]);

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
      const flatBlocks = flattenBlocks(localBlocks.length > 0 ? localBlocks : blocks);
      const currentIndex = flatBlocks.findIndex((b) => b.block_id === currentBlockId);
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
          const prevBlock = document.querySelector(`[data-block-id="${flatBlocks[currentIndex - 1].block_id}"]`);
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
        if (cursorOffset === textContent.length && currentIndex < flatBlocks.length - 1) {
          e.preventDefault();
          const nextBlock = document.querySelector(`[data-block-id="${flatBlocks[currentIndex + 1].block_id}"]`);
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
  }, [blocks, localBlocks]);

  // Flatten blocks for navigation
  const flattenBlocks = (blocks: DocumentBlock[], parentId: string | null = null): DocumentBlock[] => {
    const result: DocumentBlock[] = [];
    const children = blocks.filter((b: DocumentBlock) => b.parent_block_id === parentId).sort((a: DocumentBlock, b: DocumentBlock) => a.order - b.order);
    
    for (const block of children) {
      result.push(block);
      result.push(...flattenBlocks(blocks, block.block_id));
    }
    
    return result;
  };

  const handleUpdateBlock = async (blockId: string, content: any) => {
    try {
      await updateBlock({ blockId, content }).unwrap();
    } catch (error) {
      console.error('Failed to update block:', error);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      // Find prev sibling to focus
      const currentBlock = blocks.find((b: DocumentBlock) => b.block_id === blockId);
      if (currentBlock) {
        const siblings = blocks.filter((b: DocumentBlock) => b.parent_block_id === currentBlock.parent_block_id);
        const currentIndex = siblings.findIndex((b: DocumentBlock) => b.block_id === blockId);
        const prevSibling = currentIndex > 0 ? siblings[currentIndex - 1] : null;
        
        await deleteBlock(blockId).unwrap();
        
        // Focus prev sibling or create new if last
        if (prevSibling) {
          setTimeout(() => {
            const prevElement = document.querySelector(`[data-block-id="${prevSibling.block_id}"]`);
            const editable = prevElement?.querySelector('[contenteditable="true"]') as HTMLElement;
            editable?.focus();
          }, 100);
        } else if (siblings.length === 1) {
          // Was last block, create new paragraph
          handleCreateBlock(currentBlock.parent_block_id);
        }
      }
    } catch (error) {
      console.error('Failed to delete block:', error);
    }
  };

  const handleCreateBlock = async (afterBlockId?: string | null, parentBlockId?: string | null) => {
    try {
      const afterBlock = afterBlockId ? blocks.find((b: DocumentBlock) => b.block_id === afterBlockId) : null;
      const newOrder = afterBlock ? afterBlock.order + 1 : 
                      (blocks.filter((b: DocumentBlock) => b.parent_block_id === (parentBlockId || null)).length);

      const result = await createBlock({
        documentId,
        type: BlockType.PARAGRAPH,
        content: { text: '' },
        order: newOrder,
        parent_block_id: parentBlockId || afterBlock?.parent_block_id || null,
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

  const handleIndent = (blockId: string) => {
    const sourceBlocks = localBlocks.length > 0 ? localBlocks : blocks;
    const currentBlock = sourceBlocks.find((b: DocumentBlock) => b.block_id === blockId);
    if (!currentBlock) return;

    // Find previous sibling at same level
    const siblings = sourceBlocks.filter(
      (b: DocumentBlock) => b.parent_block_id === currentBlock.parent_block_id
    );
    const currentIndex = siblings.findIndex((b: DocumentBlock) => b.block_id === blockId);
    
    if (currentIndex > 0) {
      const prevSibling = siblings[currentIndex - 1];
      
      // Optimistically update local state: make current block a child of previous sibling
      const childCount = sourceBlocks.filter(
        (b: DocumentBlock) => b.parent_block_id === prevSibling.block_id
      ).length;

      const updatedBlocks = sourceBlocks.map((b: DocumentBlock) =>
        b.block_id === blockId
          ? {
              ...b,
              parent_block_id: prevSibling.block_id,
              order: childCount,
            }
          : b
      );

      setLocalBlocks(updatedBlocks);

      // Fire backend update without blocking UI
      updateBlock({
        blockId,
        content: currentBlock.content,
        parent_block_id: prevSibling.block_id,
        order: childCount,
      })
        .unwrap()
        .catch((error) => {
          console.error('Failed to indent block:', error);
        });
    }
  };

  const handleOutdent = (blockId: string) => {
    const sourceBlocks = localBlocks.length > 0 ? localBlocks : blocks;
    const currentBlock = sourceBlocks.find((b: DocumentBlock) => b.block_id === blockId);
    if (!currentBlock || !currentBlock.parent_block_id) return;

    const parentBlock = sourceBlocks.find(
      (b: DocumentBlock) => b.block_id === currentBlock.parent_block_id
    );
    if (!parentBlock) return;

    // Move block to parent's level, after parent
    const newParentId = parentBlock.parent_block_id || null;
    const newOrder = parentBlock.order + 1;

    const updatedBlocks = sourceBlocks.map((b: DocumentBlock) =>
      b.block_id === blockId
        ? {
            ...b,
            parent_block_id: newParentId,
            order: newOrder,
          }
        : b
    );

    setLocalBlocks(updatedBlocks);

    updateBlock({
      blockId,
      content: currentBlock.content,
      parent_block_id: newParentId,
      order: newOrder,
    })
      .unwrap()
      .catch((error) => {
        console.error('Failed to outdent block:', error);
      });
  };

  const handleAddBlock = () => {
    handleCreateBlock(null, null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const nextOverId = event.over?.id as string | null;
    setOverId(nextOverId);

    if (!event.over) {
      setDropPosition(null);
      return;
    }

    const translatedTop = event.active.rect.current.translated?.top;
    const overTop = event.over.rect.top;
    const overHeight = event.over.rect.height;

    if (translatedTop === undefined) {
      setDropPosition('before');
      return;
    }

    const middle = overTop + overHeight / 2;
    setDropPosition(translatedTop < middle ? 'before' : 'inside');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    const projectedDropPosition = dropPosition;
    setDropPosition(null);

    if (!over || active.id === over.id) {
      return;
    }

    const sourceBlocks = localBlocks.length > 0 ? localBlocks : blocks;
    const draggedBlock = sourceBlocks.find((b: DocumentBlock) => b.block_id === active.id);
    const targetBlock = sourceBlocks.find((b: DocumentBlock) => b.block_id === over.id);

    if (!draggedBlock || !targetBlock) {
      return;
    }

    // Prevent dragging block into its own children (circular reference)
    const isDescendant = (parentId: string, childId: string): boolean => {
      const child = sourceBlocks.find((b: DocumentBlock) => b.block_id === childId);
      if (!child || !child.parent_block_id) return false;
      if (child.parent_block_id === parentId) return true;
      return isDescendant(parentId, child.parent_block_id);
    };

    if (isDescendant(draggedBlock.block_id, targetBlock.block_id)) {
      return; // Prevent circular reference
    }

    let newParentId: string | null = null;
    let newOrder = 0;

    // Use projected drop position from dragOver
    if (projectedDropPosition === 'before') {
      newParentId = targetBlock.parent_block_id || null;
      newOrder = targetBlock.order;
    } else {
      newParentId = targetBlock.block_id;
      const existingChildren = sourceBlocks.filter(
        (b: DocumentBlock) => b.parent_block_id === newParentId && b.block_id !== draggedBlock.block_id
      );
      newOrder = existingChildren.length;
    }

    // Update all blocks with new structure
    let updatedBlocks = sourceBlocks.map((b: DocumentBlock) => {
      if (b.block_id === draggedBlock.block_id) {
        return { ...b, parent_block_id: newParentId, order: newOrder };
      }
      
      // If inserting before target, shift orders of siblings
      if (
        projectedDropPosition === 'before' &&
        b.parent_block_id === newParentId &&
        b.order >= newOrder &&
        b.block_id !== draggedBlock.block_id
      ) {
        return { ...b, order: b.order + 1 };
      }
      
      return b;
    });

    // Recalculate orders for all siblings at the new level to ensure sequential ordering
    const siblings = updatedBlocks
      .filter((b: DocumentBlock) => b.parent_block_id === newParentId)
      .sort((a: DocumentBlock, b: DocumentBlock) => a.order - b.order);

    // Reassign sequential orders
    const finalBlocks = updatedBlocks.map((b: DocumentBlock) => {
      const siblingIndex = siblings.findIndex((s: DocumentBlock) => s.block_id === b.block_id);
      if (siblingIndex !== -1 && b.parent_block_id === newParentId) {
        return { ...b, order: siblingIndex };
      }
      return b;
    });

    setLocalBlocks(finalBlocks);

    // Update backend
    const finalBlock = finalBlocks.find((b: DocumentBlock) => b.block_id === draggedBlock.block_id);
    if (finalBlock) {
      updateBlock({
        blockId: draggedBlock.block_id,
        content: draggedBlock.content,
        parent_block_id: finalBlock.parent_block_id,
        order: finalBlock.order,
      })
        .unwrap()
        .catch((error) => {
          console.error('Failed to move block:', error);
          setLocalBlocks([...blocks]);
        });
    }
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

  if (isLoading) {
    return <div className="py-8 text-center text-gray-500">Loading...</div>;
  }

  const blocksToRender = localBlocks.length > 0 ? localBlocks : blocks;
  // All block IDs for SortableContext (hierarchical DnD)
  const allBlockIds = blocksToRender.map((b: DocumentBlock) => b.block_id);

  return (
    <>
      <FloatingToolbar onFormat={handleFormat} />
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragCancel={() => {
          setActiveId(null);
          setOverId(null);
          setDropPosition(null);
        }}
        onDragEnd={handleDragEnd}
      >
        <div className="pl-2">
          <SortableContext
            items={allBlockIds}
            strategy={verticalListSortingStrategy}
          >
            <BlockTree
              blocks={blocksToRender}
              parentId={null}
              dropOverId={overId}
              dropPosition={dropPosition}
              onUpdate={handleUpdateBlock}
              onDelete={handleDeleteBlock}
              onCreate={handleCreateBlock}
              onConvert={handleConvertBlock}
              onIndent={handleIndent}
              onOutdent={handleOutdent}
            />
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
