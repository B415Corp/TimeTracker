import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { DocumentBlock, BlockType } from '@shared/types/document.types';
import { Check } from 'lucide-react';

interface ListBlockProps {
  block: DocumentBlock;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onIndent?: (blockId: string) => void;
  onOutdent?: (blockId: string) => void;
  onFocus?: () => void;
}

interface ListItem {
  id: string;
  text: string;
  checked?: boolean;
  indent?: number;
}

export const ListBlock = ({ block, onUpdate, onDelete, onCreate, onIndent, onOutdent, onFocus }: ListBlockProps) => {
  const [items, setItems] = useState<ListItem[]>(
    block.content?.items || [{ id: crypto.randomUUID(), text: '' }]
  );
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const blockItems = block.content?.items || [];
    if (blockItems.length === 0) {
      setItems([{ id: crypto.randomUUID(), text: '' }]);
    } else {
      setItems(blockItems);
    }
  }, [block.content?.items]);

  const isChecklist = block.type === BlockType.CHECKLIST;
  const isNumbered = block.type === BlockType.NUMBERED_LIST;

  const handleItemInput = (itemId: string, newText: string) => {
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, text: newText } : item
    );
    setItems(newItems);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onUpdate(block.block_id, { items: newItems });
    }, 300);
  };

  const handleItemKeyDown = (e: KeyboardEvent<HTMLDivElement>, itemId: string, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const currentText = items[index].text;
      
      // Always create new item, even if empty
      // Only exit list if user presses Enter twice on empty item
      if (currentText.trim() === '' && items.length === 1) {
        // Single empty item - exit list
        onDelete(block.block_id);
        onCreate(block.block_id);
      } else if (currentText.trim() === '') {
        // Multiple items and current is empty - exit list
        onDelete(block.block_id);
        onCreate(block.block_id);
      } else {
        // Create new item with same indent
        const newItem: ListItem = { 
          id: crypto.randomUUID(), 
          text: '',
          indent: items[index].indent || 0
        };
        const newItems = [
          ...items.slice(0, index + 1),
          newItem,
          ...items.slice(index + 1),
        ];
        setItems(newItems);
        onUpdate(block.block_id, { items: newItems });
        
        // Focus new item
        setTimeout(() => {
          const newItemRef = itemRefs.current[newItem.id];
          if (newItemRef) {
            newItemRef.focus();
          }
        }, 0);
      }
    }

    if (e.key === 'Backspace') {
      const currentText = items[index].text;
      const selection = window.getSelection();
      const cursorAtStart = selection?.anchorOffset === 0;

      if (cursorAtStart && currentText === '') {
        e.preventDefault();
        if (items.length === 1) {
          // Last item - delete block
          onDelete(block.block_id);
        } else {
          // Remove item
          const newItems = items.filter((item) => item.id !== itemId);
          setItems(newItems);
          onUpdate(block.block_id, { items: newItems });
          
          // Focus previous item
          const prevIndex = Math.max(0, index - 1);
          setTimeout(() => {
            const prevItemRef = itemRefs.current[newItems[prevIndex].id];
            if (prevItemRef) {
              prevItemRef.focus();
            }
          }, 0);
        }
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      
      // Use block-level indent/outdent for consistent behavior
      if (e.shiftKey && onOutdent) {
        onOutdent(block.block_id);
      } else if (!e.shiftKey && onIndent) {
        onIndent(block.block_id);
      }
    }
  };

  const handleToggleCheck = (itemId: string) => {
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    setItems(newItems);
    onUpdate(block.block_id, { items: newItems });
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="relative group">
      <div className="space-y-1">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-start gap-2">
            {isChecklist ? (
              <button
                type="button"
                onClick={() => handleToggleCheck(item.id)}
                className="mt-1 flex-shrink-0"
                onFocus={handleFocus}
              >
                <div
                  className={`w-4 h-4 border-2 rounded ${
                    item.checked
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 dark:border-gray-600'
                  } flex items-center justify-center`}
                >
                  {item.checked && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            ) : (
              <span className="text-gray-400 dark:text-gray-600 mt-1 flex-shrink-0">
                {isNumbered ? `${index + 1}.` : '•'}
              </span>
            )}
            <div
              ref={(el) => (itemRefs.current[item.id] = el)}
              contentEditable
              onInput={(e) => handleItemInput(item.id, e.currentTarget.textContent || '')}
              onKeyDown={(e) => handleItemKeyDown(e, item.id, index)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`flex-1 min-h-[1.5rem] outline-none text-[15px] px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-900 dark:text-gray-100 ${
                item.checked ? 'line-through text-gray-500' : ''
              } empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400`}
              suppressContentEditableWarning
              data-placeholder="List item..."
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
