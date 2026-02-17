import { useRef, KeyboardEvent, useLayoutEffect, useMemo } from 'react';
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
  onIndent?: (blockId: string) => void;
  onOutdent?: (blockId: string) => void;
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
  onIndent,
  onOutdent,
  allowFormatting = true,
}: EditableBlockProps) => {
  const ref = useRef<HTMLElement>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize content ONCE on mount or block change
  useLayoutEffect(() => {
    if (ref.current) {
      const currentContent = ref.current.innerHTML;
      const newContent = block.content?.html || block.content?.text || '';
      
      // Only update if content actually changed (avoid cursor jump)
      if (currentContent !== newContent) {
        if (allowFormatting && block.content?.html) {
          ref.current.innerHTML = block.content.html;
        } else {
          ref.current.textContent = block.content?.text || '';
        }
      }
    }
  }, [block.block_id]); // Only on block ID change

  const getText = () => ref.current?.textContent || '';
  const getHTML = () => ref.current?.innerHTML || '';

  // Debounced update function
  const debouncedUpdate = useMemo(
    () => {
      let timeout: NodeJS.Timeout;
      return () => {
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }
        
        updateTimeoutRef.current = setTimeout(() => {
          const text = getText();
          const html = allowFormatting ? getHTML() : undefined;
          onUpdate(block.block_id, { text, html });
        }, 300);
      };
    },
    [block.block_id, onUpdate, allowFormatting]
  );

  const handleInput = () => {
    const text = getText();

    // Check for slash command
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && onShowSlashMenu) {
      const range = selection.getRangeAt(0);
      const textBeforeCursor = text.substring(0, range.startOffset);
      const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

      if (lastSlashIndex !== -1 && lastSlashIndex === textBeforeCursor.length - 1) {
        // Just typed "/"
        onShowSlashMenu(true, '');
        return; // Don't save yet
      } else if (lastSlashIndex !== -1) {
        // Typing after "/"
        const query = textBeforeCursor.substring(lastSlashIndex + 1);
        if (!query.includes(' ')) {
          onShowSlashMenu(true, query);
          return; // Don't save yet
        } else {
          onShowSlashMenu(false, '');
        }
      }
    }

    // Debounced save to backend
    debouncedUpdate();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const text = getText();

    // Tab - indent/outdent
    if (e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation(); // Prevent default browser behavior
      
      if (e.shiftKey && onOutdent) {
        onOutdent(block.block_id);
      } else if (!e.shiftKey && onIndent) {
        onIndent(block.block_id);
      }
      return;
    }

    // Enter - create new block
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      
      // Save current block immediately
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      onUpdate(block.block_id, { text, html: allowFormatting ? getHTML() : undefined });
      
      // Create new block
      onCreate(block.block_id);
      return;
    }

    // Backspace on empty block - delete it
    if (e.key === 'Backspace' && text === '') {
      e.preventDefault();
      e.stopPropagation();
      onDelete(block.block_id);
      return;
    }

    // Space - check for markdown shortcuts
    if (e.key === ' ' && onConvert) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textBeforeCursor = text.substring(0, range.startOffset);
        
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
