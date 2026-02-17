import { DocumentBlock } from '@shared/types/document.types';
import { EditableBlock } from './EditableBlock';

interface QuoteBlockProps {
  block: DocumentBlock;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onIndent?: (blockId: string) => void;
  onOutdent?: (blockId: string) => void;
  onFocus?: () => void;
}

export const QuoteBlock = ({ block, onUpdate, onDelete, onCreate, onIndent, onOutdent, onFocus }: QuoteBlockProps) => {
  return (
    <div className="relative group border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-1">
      <EditableBlock
        block={block}
        placeholder="Quote..."
        className="text-[15px] text-gray-700 dark:text-gray-300 italic hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded px-2 py-1 transition-colors empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
        onUpdate={onUpdate}
        onDelete={onDelete}
        onCreate={onCreate}
        onIndent={onIndent}
        onOutdent={onOutdent}
      />
    </div>
  );
};
