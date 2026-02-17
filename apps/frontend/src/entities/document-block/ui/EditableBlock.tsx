import { useRef, KeyboardEvent, useEffect } from 'react';
import { DocumentBlock, BlockType } from '@shared/types/document.types';

interface EditableBlockProps {
  block: DocumentBlock;
  placeholder?: string;
  className?: string;
  as?: 'div' | 'h1' | 'h2' | 'h3';
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onConvert?: (blockId: string, type: BlockType) => void;
  onShowSlashMenu?: (show: boolean, query: string) => void;
  allowFormatting?: boolean;
}

export const EditableBlock = ({
  block,
  placeholder = 'Type / for commands...',
  className = '',
  as: Component = 'div',
  onUpdate,
  onDelete,
  onCreate,
  onConvert,
  onShowSlashMenu,
  allowFormatting = true,
}: EditableBlockProps) => {
  const ref = useRef<HTMLElement>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();
  const isInitializedRef = useRef(false);

  // Initialize content once
  useEffect(() => {
    if (!isInitializedRef.current && ref.current) {
      const content = block.content?.text || '';
      
      if (block.content?.html && allowFormatting) {
        ref.current.innerHTML = block.content.html;
      } else {
        ref.current.textContent = content;
      }
      
      isInitializedRef.current = true;
    }
  }, []);

  const getText = () => ref.current?.textContent || '';

  const handleInput = () => {
    const text = getText();
    const html = allowFormatting && ref.current ? ref.current.innerHTML : undefined;

    // Clear previous timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Check for slash command
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && onShowSlashMenu) {
      const offset = selection.getRangeAt(0).startOffset;
      const textBeforeCursor = text.substring(0, offset);
      const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

      if (lastSlashIndex !== -1 && lastSlashIndex === offset - 1) {
        // Just typed "/"
        onShowSlashMenu(true, '');
      } else if (lastSlashIndex !== -1) {
        // Typing after "/"
        const query = textBeforeCursor.substring(lastSlashIndex + 1);
        if (!query.includes(' ')) {
          onShowSlashMenu(true, query);
        } else {
          onShowSlashMenu(false, '');
        }
      }
    }

    // Debounced save to backend
    updateTimeoutRef.current = setTimeout(() => {
      onUpdate(block.block_id, { text, html });
    }, 500);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const text = getText();

    // Enter - create new block immediately
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      // Cancel pending update
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Save current block immediately
      onUpdate(block.block_id, { text });
      
      // Create new block (this will trigger re-fetch and new block will be focused)
      onCreate(block.block_id);
      return;
    }

    // Backspace on empty block - delete it
    if (e.key === 'Backspace' && text === '') {
      e.preventDefault();
      onDelete(block.block_id);
      return;
    }

    // Space - check for markdown shortcuts
    if (e.key === ' ' && onConvert) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const offset = selection.getRangeAt(0).startOffset;
        const textBeforeCursor = text.substring(0, offset);
        
        // Heading shortcuts: # ## ###
        if (textBeforeCursor === '#' || textBeforeCursor === '##' || textBeforeCursor === '###') {
          e.preventDefault();
          const level = textBeforeCursor.length;
          ref.current!.textContent = '';
          onConvert(block.block_id, `heading_${level}` as BlockType);
          return;
        }
        
        // Quote: >
        if (textBeforeCursor === '>') {
          e.preventDefault();
          ref.current!.textContent = '';
          onConvert(block.block_id, BlockType.QUOTE);
          return;
        }
        
        // Bullet list: - or *
        if (textBeforeCursor === '-' || textBeforeCursor === '*') {
          e.preventDefault();
          ref.current!.textContent = '';
          onConvert(block.block_id, BlockType.BULLET_LIST);
          return;
        }
        
        // Numbered list: 1.
        if (textBeforeCursor.match(/^\d+\.$/)) {
          e.preventDefault();
          ref.current!.textContent = '';
          onConvert(block.block_id, BlockType.NUMBERED_LIST);
          return;
        }
      }
    }
  };

  return (
    <Component
      ref={ref as any}
      contentEditable
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      suppressContentEditableWarning
      className={`outline-none ${className}`}
      data-placeholder={placeholder}
    />
  );
};
