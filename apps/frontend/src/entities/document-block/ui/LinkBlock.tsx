import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { DocumentBlock, BlockType } from '@shared/types/document.types';
import { ExternalLink, Globe, X } from 'lucide-react';

interface LinkBlockProps {
  block: DocumentBlock;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onFocus?: () => void;
}

export const LinkBlock = ({ block, onUpdate, onDelete, onCreate, onFocus }: LinkBlockProps) => {
  const [url, setUrl] = useState(block.content?.url || '');
  const [title, setTitle] = useState(block.content?.title || '');
  const [description, setDescription] = useState(block.content?.description || '');
  const [isEditing, setIsEditing] = useState(!block.content?.url);
  const [isFocused, setIsFocused] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const isEmbed = block.type === BlockType.LINK_EMBED;

  useEffect(() => {
    setUrl(block.content?.url || '');
    setTitle(block.content?.title || '');
    setDescription(block.content?.description || '');
    setIsEditing(!block.content?.url);
  }, [block.content]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
  };

  const handleUrlKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleSave = async () => {
    if (!url.trim()) {
      onDelete(block.block_id);
      return;
    }

    // Try to fetch metadata if it's a bookmark
    if (!isEmbed && !title) {
      try {
        // In a real app, you'd call a backend endpoint to fetch metadata
        // For now, we'll just use the URL
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        setTitle(urlObj.hostname);
      } catch (error) {
        setTitle(url);
      }
    }

    setIsEditing(false);
    onUpdate(block.block_id, {
      url: url.trim(),
      title: title || url,
      description,
      type: isEmbed ? 'embed' : 'bookmark',
    });
  };

  const handleTitleChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newTitle = e.currentTarget.textContent || '';
    setTitle(newTitle);
    onUpdate(block.block_id, {
      url,
      title: newTitle,
      description,
    });
  };

  const handleDescriptionChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newDescription = e.currentTarget.textContent || '';
    setDescription(newDescription);
    onUpdate(block.block_id, {
      url,
      title,
      description: newDescription,
    });
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  if (isEditing) {
    return (
      <div className="relative group border border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <input
            ref={urlInputRef}
            type="text"
            value={url}
            onChange={handleUrlChange}
            onKeyDown={handleUrlKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Paste a link..."
            className="flex-1 outline-none bg-transparent text-sm text-gray-900 dark:text-gray-100"
            autoFocus
          />
          <button
            onClick={() => setIsEditing(false)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={handleSave}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          Create link
        </button>
      </div>
    );
  }

  if (isEmbed) {
    return (
      <div className="relative group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <iframe
          src={url}
          className="w-full h-96"
          title={title || 'Embedded content'}
        />
        <button
          onClick={() => onDelete(block.block_id)}
          className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Bookmark view
  return (
    <div className="relative group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey) return; // Allow Cmd/Ctrl+click
          e.preventDefault();
          window.open(url, '_blank');
        }}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1 truncate">
                {title || url}
              </div>
              {description && (
                <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {description}
                </div>
              )}
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 dark:text-gray-500">
                <Globe className="w-3 h-3" />
                <span className="truncate">{url}</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
          </div>
        </div>
      </a>
      <button
        onClick={() => onDelete(block.block_id)}
        className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
