import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { DocumentBlock } from '@shared/types/document.types';

interface HeadingBlockProps {
  block: DocumentBlock;
  level: 1 | 2 | 3;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onFocus?: () => void;
}

export const HeadingBlock = ({ block, level, onUpdate, onDelete, onCreate, onFocus }: HeadingBlockProps) => {
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

  const HeadingComponent = `h${level}` as keyof JSX.IntrinsicElements;
  const sizeClasses = {
    1: 'text-3xl font-bold',
    2: 'text-2xl font-bold',
    3: 'text-xl font-semibold',
  };

  return (
    <div className={`relative group ${isFocused ? 'ring-1 ring-blue-200' : ''}`}>
      <HeadingComponent
        ref={inputRef as any}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`min-h-[1.5rem] px-2 py-2 outline-none text-gray-900 dark:text-gray-100 ${sizeClasses[level]}`}
        suppressContentEditableWarning
        data-placeholder={`Heading ${level}`}
      >
        {text}
      </HeadingComponent>
    </div>
  );
};
