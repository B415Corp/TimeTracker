import { useState, useRef, useEffect, MouseEvent } from 'react';
import { DocumentBlock, BlockType } from '@shared/types/document.types';
import { SlashCommandMenu } from '@features/document-editor/SlashCommandMenu';
import { EditableBlock } from './EditableBlock';

interface ParagraphBlockProps {
  block: DocumentBlock;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onConvert?: (blockId: string, type: BlockType) => void;
  onFocus?: () => void;
}

export const ParagraphBlock = ({ block, onUpdate, onDelete, onCreate, onConvert, onFocus }: ParagraphBlockProps) => {
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [menuPosition, setMenuPosition] = useState<{ top?: number; bottom?: number; left: number }>({ left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleShowSlashMenu = (show: boolean, query: string) => {
    setShowSlashMenu(show);
    setSlashQuery(query);
  };

  const handleSlashSelect = (type: BlockType) => {
    setShowSlashMenu(false);
    setSlashQuery('');
    
    if (onConvert) {
      // Convert block immediately
      onConvert(block.block_id, type);
    }
  };

  // Calculate menu position to keep it within viewport
  useEffect(() => {
    if (showSlashMenu && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const menuHeight = 320; // max-h-80 = 320px
      const menuWidth = 256; // w-64 = 256px
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let position: { top?: number; bottom?: number; left: number } = { left: 0 };

      // Check if menu fits below
      const spaceBelow = viewportHeight - containerRect.bottom;
      const spaceAbove = containerRect.top;

      if (spaceBelow >= menuHeight || spaceBelow >= spaceAbove) {
        // Show below
        position.top = containerRect.bottom + 4;
      } else {
        // Show above
        position.bottom = viewportHeight - containerRect.top + 4;
      }

      // Check horizontal position
      let left = containerRect.left;
      if (left + menuWidth > viewportWidth) {
        left = viewportWidth - menuWidth - 16;
      }
      position.left = Math.max(16, left);

      setMenuPosition(position);
    }
  }, [showSlashMenu]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSlashMenu(false);
      }
    };

    if (showSlashMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSlashMenu]);

  return (
    <div ref={containerRef} className="relative group">
      <EditableBlock
        block={block}
        placeholder="Type '/' for commands..."
        className="min-h-[28px] px-2 py-1.5 text-[15px] text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded transition-colors empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
        onUpdate={onUpdate}
        onDelete={onDelete}
        onCreate={onCreate}
        onConvert={onConvert}
        onShowSlashMenu={handleShowSlashMenu}
      />
      
      {showSlashMenu && (
        <div 
          ref={menuRef}
          className="fixed z-50"
          style={{
            top: menuPosition.top,
            bottom: menuPosition.bottom,
            left: menuPosition.left,
          }}
        >
          <SlashCommandMenu
            onSelect={handleSlashSelect}
            onClose={() => setShowSlashMenu(false)}
            searchQuery={slashQuery}
          />
        </div>
      )}
    </div>
  );
};
