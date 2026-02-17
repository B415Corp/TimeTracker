import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { DocumentBlock } from '@shared/types/document.types';

interface ParagraphBlockProps {
  block: DocumentBlock;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onFocus?: () => void;
}

export const ParagraphBlock = ({ block, onUpdate, onDelete, onCreate, onFocus }: ParagraphBlockProps) => {
  const [text, setText] = useState(block.content?.text || '');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setText(block.content?.text || '');
  }, [block.content?.text]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || '';
    setText(newText);

    // Debounced update
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onUpdate(block.block_id, { text: newText });
    }, 300);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onCreate(block.block_id);
    }

    if (e.key === 'Backspace' && text === '') {
      e.preventDefault();
      onDelete(block.block_id);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`relative group ${isFocused ? 'ring-1 ring-blue-200' : ''}`}>
      <div
        ref={inputRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="min-h-[1.5rem] px-2 py-1 outline-none text-sm text-gray-900 dark:text-gray-100"
        suppressContentEditableWarning
        data-placeholder="Type '/' for commands..."
      >
        {text}
      </div>
    </div>
  );
};
