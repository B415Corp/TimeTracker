import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { DocumentBlock } from '@shared/types/document.types';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  block: DocumentBlock;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onFocus?: () => void;
}

export const CodeBlock = ({ block, onUpdate, onDelete, onCreate, onFocus }: CodeBlockProps) => {
  const [code, setCode] = useState(block.content?.code || '');
  const [language, setLanguage] = useState(block.content?.language || 'javascript');
  const [isFocused, setIsFocused] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setCode(block.content?.code || '');
    setLanguage(block.content?.language || 'javascript');
  }, [block.content]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onUpdate(block.block_id, { code: newCode, language });
    }, 300);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    onUpdate(block.block_id, { code, language: newLanguage });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      onCreate(block.block_id);
    }

    if (e.key === 'Backspace' && code === '') {
      e.preventDefault();
      onDelete(block.block_id);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-t-md border-b border-gray-200 dark:border-gray-700">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="text-xs bg-transparent border-none outline-none text-gray-600 dark:text-gray-400"
          onFocus={handleFocus}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
          <option value="json">JSON</option>
          <option value="sql">SQL</option>
          <option value="bash">Bash</option>
          <option value="plaintext">Plain Text</option>
        </select>
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={code}
        onChange={handleCodeChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full min-h-[150px] p-3 bg-gray-50 dark:bg-gray-900 font-mono text-sm text-gray-900 dark:text-gray-100 rounded-b-md outline-none resize-y"
        placeholder="Enter code..."
        spellCheck={false}
      />
    </div>
  );
};
