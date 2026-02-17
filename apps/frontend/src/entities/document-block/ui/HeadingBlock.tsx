import { DocumentBlock, BlockType } from '@shared/types/document.types';
import { EditableBlock } from './EditableBlock';

interface HeadingBlockProps {
  block: DocumentBlock;
  level: 1 | 2 | 3;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onFocus?: () => void;
}

export const HeadingBlock = ({ block, level, onUpdate, onDelete, onCreate, onFocus }: HeadingBlockProps) => {
  const headingClasses = {
    1: 'text-3xl font-bold mt-4 mb-2',
    2: 'text-2xl font-bold mt-3 mb-1.5',
    3: 'text-xl font-semibold mt-2 mb-1',
  };

  const Component = `h${level}` as 'h1' | 'h2' | 'h3';

  return (
    <div className="relative group">
      <EditableBlock
        block={block}
        as={Component}
        placeholder={`Heading ${level}`}
        className={`${headingClasses[level]} px-2 py-1.5 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded transition-colors empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none empty:before:font-normal empty:before:text-base`}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onCreate={onCreate}
      />
    </div>
  );
};
