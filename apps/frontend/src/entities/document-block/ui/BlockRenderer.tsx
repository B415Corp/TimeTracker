import { DocumentBlock, BlockType } from '@shared/types/document.types';
import { ParagraphBlock } from './ParagraphBlock';
import { HeadingBlock } from './HeadingBlock';
import { DividerBlock } from './DividerBlock';
import { QuoteBlock } from './QuoteBlock';
import { CodeBlock } from './CodeBlock';
import { CalloutBlock } from './CalloutBlock';
import { ListBlock } from './ListBlock';
import { TableBlock } from './TableBlock';
import { ImageBlock } from './ImageBlock';
import { FileBlock } from './FileBlock';
import { LinkBlock } from './LinkBlock';

interface BlockRendererProps {
  block: DocumentBlock;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onConvert?: (blockId: string, type: BlockType) => void;
  onFocus?: () => void;
}

export const BlockRenderer = ({ block, onUpdate, onDelete, onCreate, onConvert, onFocus }: BlockRendererProps) => {
  switch (block.type) {
    case BlockType.PARAGRAPH:
      return (
        <ParagraphBlock
          block={block}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCreate={onCreate}
          onConvert={onConvert}
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

    case BlockType.QUOTE:
      return (
        <QuoteBlock
          block={block}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCreate={onCreate}
          onFocus={onFocus}
        />
      );

    case BlockType.CODE:
      return (
        <CodeBlock
          block={block}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCreate={onCreate}
          onFocus={onFocus}
        />
      );

    case BlockType.CALLOUT:
      return (
        <CalloutBlock
          block={block}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCreate={onCreate}
          onFocus={onFocus}
        />
      );

    case BlockType.BULLET_LIST:
    case BlockType.NUMBERED_LIST:
    case BlockType.CHECKLIST:
      return (
        <ListBlock
          block={block}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCreate={onCreate}
          onFocus={onFocus}
        />
      );

    case BlockType.TABLE:
      return (
        <TableBlock
          block={block}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCreate={onCreate}
          onFocus={onFocus}
        />
      );

    case BlockType.IMAGE:
      return (
        <ImageBlock
          block={block}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCreate={onCreate}
          onFocus={onFocus}
        />
      );

    case BlockType.FILE:
      return (
        <FileBlock
          block={block}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCreate={onCreate}
          onFocus={onFocus}
        />
      );

    case BlockType.LINK_BOOKMARK:
    case BlockType.LINK_EMBED:
      return (
        <LinkBlock
          block={block}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCreate={onCreate}
          onFocus={onFocus}
        />
      );

    default:
      return (
        <div className="text-gray-500 italic">
          Block type "{block.type}" not implemented yet
        </div>
      );
  }
};
