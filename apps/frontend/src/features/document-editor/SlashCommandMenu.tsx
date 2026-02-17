import { useState, useEffect, useRef } from 'react';
import { BlockType } from '@shared/types/document.types';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Table,
  Image,
  File,
  Link,
  Code,
  Minus,
  Quote,
  AlertCircle,
} from 'lucide-react';

interface SlashCommand {
  type: BlockType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
}

const slashCommands: SlashCommand[] = [
  {
    type: BlockType.PARAGRAPH,
    label: 'Text',
    description: 'Just start typing with plain text',
    icon: Type,
    keywords: ['text', 'paragraph', 'p'],
  },
  {
    type: BlockType.HEADING_1,
    label: 'Heading 1',
    description: 'Big section heading',
    icon: Heading1,
    keywords: ['h1', 'heading1', 'title'],
  },
  {
    type: BlockType.HEADING_2,
    label: 'Heading 2',
    description: 'Medium section heading',
    icon: Heading2,
    keywords: ['h2', 'heading2', 'subtitle'],
  },
  {
    type: BlockType.HEADING_3,
    label: 'Heading 3',
    description: 'Small section heading',
    icon: Heading3,
    keywords: ['h3', 'heading3'],
  },
  {
    type: BlockType.BULLET_LIST,
    label: 'Bulleted List',
    description: 'Create a simple bulleted list',
    icon: List,
    keywords: ['bullet', 'ul', 'unordered'],
  },
  {
    type: BlockType.NUMBERED_LIST,
    label: 'Numbered List',
    description: 'Create a list with numbering',
    icon: ListOrdered,
    keywords: ['number', 'ol', 'ordered'],
  },
  {
    type: BlockType.CHECKLIST,
    label: 'To-do List',
    description: 'Track tasks with a to-do list',
    icon: CheckSquare,
    keywords: ['todo', 'checklist', 'task'],
  },
  {
    type: BlockType.TABLE,
    label: 'Table',
    description: 'Add a table',
    icon: Table,
    keywords: ['table', 'grid'],
  },
  {
    type: BlockType.IMAGE,
    label: 'Image',
    description: 'Upload or embed an image',
    icon: Image,
    keywords: ['image', 'img', 'picture', 'photo'],
  },
  {
    type: BlockType.FILE,
    label: 'File',
    description: 'Upload a file',
    icon: File,
    keywords: ['file', 'upload', 'attachment'],
  },
  {
    type: BlockType.LINK_BOOKMARK,
    label: 'Bookmark',
    description: 'Add a bookmark link',
    icon: Link,
    keywords: ['link', 'bookmark', 'url'],
  },
  {
    type: BlockType.LINK_EMBED,
    label: 'Embed',
    description: 'Embed a link',
    icon: Link,
    keywords: ['embed', 'iframe'],
  },
  {
    type: BlockType.CODE,
    label: 'Code Block',
    description: 'Capture a code snippet',
    icon: Code,
    keywords: ['code', 'snippet'],
  },
  {
    type: BlockType.QUOTE,
    label: 'Quote',
    description: 'Capture a quote',
    icon: Quote,
    keywords: ['quote', 'citation'],
  },
  {
    type: BlockType.CALLOUT,
    label: 'Callout',
    description: 'Make writing stand out',
    icon: AlertCircle,
    keywords: ['callout', 'alert', 'info'],
  },
  {
    type: BlockType.DIVIDER,
    label: 'Divider',
    description: 'Visually divide blocks',
    icon: Minus,
    keywords: ['divider', 'hr', 'line'],
  },
];

interface SlashCommandMenuProps {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  searchQuery?: string;
}

export const SlashCommandMenu = ({ onSelect, onClose, searchQuery = '' }: SlashCommandMenuProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  const filteredCommands = slashCommands.filter((cmd) => {
    const query = searchQuery.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(query) ||
      cmd.description.toLowerCase().includes(query) ||
      cmd.keywords.some((kw) => kw.toLowerCase().includes(query))
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const selectedItem = itemRefs.current[selectedIndex];
    if (selectedItem && menuRef.current) {
      selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (filteredCommands[selectedIndex]) {
          onSelect(filteredCommands[selectedIndex].type);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [selectedIndex, filteredCommands, onSelect, onClose]);

  if (filteredCommands.length === 0) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto"
    >
      {filteredCommands.map((command, index) => {
        const Icon = command.icon;
        return (
          <button
            key={command.type}
            ref={(el) => (itemRefs.current[index] = el)}
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent blur
              onSelect(command.type);
            }}
            className={`w-full flex items-start gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
              index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {command.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {command.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
