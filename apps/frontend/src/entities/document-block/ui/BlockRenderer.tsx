import { DocumentBlock, BlockType } from '@shared/types/document.types';
import { ParagraphBlock } from './ParagraphBlock';
import { HeadingBlock } from './HeadingBlock';
import { DividerBlock } from './DividerBlock';

interface BlockRendererProps {
  block: DocumentBlock;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onFocus?: () => void;
}

export const BlockRenderer = ({ block, onUpdate, onDelete, onCreate, onFocus }: BlockRendererProps) => {
  switch (block.type) {
    case BlockType.PARAGRAPH:
      return (
        <ParagraphBlock
          block={block}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCreate={onCreate}
          onFocus={onFocus}
        />
      );

    case BlockType.HEADING_1:
      return (
        <HeadingBlock
          block={block}
          level={1}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCreate={onCreate}
          onFocus={onFocus}
        />
      );

    case BlockType.HEADING_2:
      return (
        <HeadingBlock
          block={block}
          level={2}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCreate={onCreate}
          onFocus={onFocus}
        />
      );

    case BlockType.HEADING_3:
      return (
        <HeadingBlock
          block={block}
          level={3}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCreate={onCreate}
          onFocus={onFocus}
        />
      );

    case BlockType.DIVIDER:
      return <DividerBlock />;

    default:
      return (
        <div className="text-gray-500 italic">
          Block type "{block.type}" not implemented yet
        </div>
      );
  }
};
