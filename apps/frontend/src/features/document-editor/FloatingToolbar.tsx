import { useEffect, useState, useRef } from 'react';
import { Bold, Italic, Underline, Link as LinkIcon, X } from 'lucide-react';

interface FloatingToolbarProps {
  onFormat: (format: 'bold' | 'italic' | 'underline' | 'link', value?: string) => void;
}

export const FloatingToolbar = ({ onFormat }: FloatingToolbarProps) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const toolbarRef = useRef<HTMLDivElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setVisible(false);
        setShowLinkInput(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const selectedText = selection.toString().trim();

      if (selectedText.length === 0) {
        setVisible(false);
        return;
      }

      // Check if selection is within contentEditable
      let node = range.commonAncestorContainer;
      let isInEditor = false;
      
      while (node && node !== document.body) {
        if ((node as HTMLElement).contentEditable === 'true') {
          isInEditor = true;
          break;
        }
        node = node.parentNode as Node;
      }

      if (!isInEditor) {
        setVisible(false);
        return;
      }

      // Position toolbar above selection
      const rect = range.getBoundingClientRect();
      const toolbarHeight = 40;
      const toolbarWidth = showLinkInput ? 300 : 160;

      let top = rect.top + window.scrollY - toolbarHeight - 8;
      let left = rect.left + window.scrollX + (rect.width / 2) - (toolbarWidth / 2);

      // Keep toolbar within viewport
      if (top < window.scrollY) {
        top = rect.bottom + window.scrollY + 8;
      }
      if (left < 16) {
        left = 16;
      }
      if (left + toolbarWidth > window.innerWidth - 16) {
        left = window.innerWidth - toolbarWidth - 16;
      }

      setPosition({ top, left });
      setVisible(true);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('scroll', handleSelectionChange, true);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('scroll', handleSelectionChange, true);
    };
  }, [showLinkInput]);

  useEffect(() => {
    if (showLinkInput && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [showLinkInput]);

  const handleFormat = (format: 'bold' | 'italic' | 'underline') => {
    onFormat(format);
    // Keep selection and toolbar visible
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        setVisible(true);
      }
    }, 10);
  };

  const handleLinkClick = () => {
    const selection = window.getSelection();
    if (!selection) return;

    // Check if already a link
    let node = selection.anchorNode;
    while (node && node !== document.body) {
      if ((node as HTMLElement).tagName === 'A') {
        const href = (node as HTMLAnchorElement).href;
        setLinkUrl(href);
        setShowLinkInput(true);
        return;
      }
      node = node.parentElement;
    }

    setLinkUrl('');
    setShowLinkInput(true);
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl.trim()) {
      onFormat('link', linkUrl);
    }
    setShowLinkInput(false);
    setLinkUrl('');
    setVisible(false);
  };

  const handleLinkCancel = () => {
    setShowLinkInput(false);
    setLinkUrl('');
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-xl border border-gray-700"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {showLinkInput ? (
        <form onSubmit={handleLinkSubmit} className="flex items-center gap-2 p-2">
          <LinkIcon className="w-4 h-4 flex-shrink-0" />
          <input
            ref={linkInputRef}
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="bg-gray-800 dark:bg-gray-700 text-white text-sm px-2 py-1 rounded outline-none focus:ring-1 focus:ring-blue-500 flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleLinkCancel();
              }
            }}
          />
          <button
            type="submit"
            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleLinkCancel}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="flex items-center gap-1 p-1">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormat('bold');
            }}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormat('italic');
            }}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormat('underline');
            }}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-700 mx-1" />
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleLinkClick();
            }}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Link (Ctrl+K)"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
