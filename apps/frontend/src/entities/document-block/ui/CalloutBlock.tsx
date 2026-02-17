import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { DocumentBlock } from '@shared/types/document.types';
import { Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface CalloutBlockProps {
  block: DocumentBlock;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onIndent?: (blockId: string) => void;
  onOutdent?: (blockId: string) => void;
  onFocus?: () => void;
}

const calloutIcons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
};

const calloutColors = {
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
};

export const CalloutBlock = ({ block, onUpdate, onDelete, onCreate, onFocus }: CalloutBlockProps) => {
  const [text, setText] = useState(block.content?.text || '');
  const [icon, setIcon] = useState(block.content?.icon || 'info');
  const [color, setColor] = useState(block.content?.color || 'info');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setText(block.content?.text || '');
    setIcon(block.content?.icon || 'info');
    setColor(block.content?.color || 'info');
  }, [block.content]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || '';
    setText(newText);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onUpdate(block.block_id, { text: newText, icon, color });
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

  const handleIconChange = (newIcon: string) => {
    setIcon(newIcon);
    onUpdate(block.block_id, { text, icon: newIcon, color });
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onUpdate(block.block_id, { text, icon, color: newColor });
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const IconComponent = calloutIcons[icon as keyof typeof calloutIcons] || Info;
  const colorClasses = calloutColors[color as keyof typeof calloutColors] || calloutColors.info;

  return (
    <div className={`relative group p-4 rounded-lg border ${colorClasses} ${isFocused ? 'ring-2 ring-blue-200' : ''}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div
            ref={inputRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="min-h-[1.5rem] outline-none text-sm"
            suppressContentEditableWarning
            data-placeholder="Callout text..."
          >
            {text}
          </div>
          {isFocused && (
            <div className="mt-2 flex gap-2 text-xs">
              <select
                value={icon}
                onChange={(e) => handleIconChange(e.target.value)}
                className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="success">Success</option>
              </select>
              <select
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="info">Blue</option>
                <option value="warning">Yellow</option>
                <option value="error">Red</option>
                <option value="success">Green</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
