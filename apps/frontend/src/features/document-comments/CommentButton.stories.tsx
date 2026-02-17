import type { Meta, StoryObj } from '@storybook/react';
import { CommentButton } from './CommentButton';
import { fn } from '@storybook/test';

const meta = {
  title: 'Features/DocumentComments/CommentButton',
  component: CommentButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof CommentButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoComments: Story = {
  args: {
    blockId: 'block-1',
    commentCount: 0,
    onClick: () => alert('Open comments'),
  },
};

export const WithComments: Story = {
  args: {
    blockId: 'block-2',
    commentCount: 5,
    onClick: () => alert('Open comments'),
  },
};

export const ManyComments: Story = {
  args: {
    blockId: 'block-3',
    commentCount: 42,
    onClick: () => alert('Open comments'),
  },
};

export const InDocumentBlock: Story = {
  render: () => (
    <div className="w-[600px] group">
      <div className="border rounded-lg p-4 hover:bg-muted/50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Заголовок документа</h3>
            <p className="text-muted-foreground">
              Это содержимое блока документа. При наведении на блок появляется
              кнопка комментариев.
            </p>
          </div>
          <CommentButton
            blockId="block-hover"
            commentCount={3}
            onClick={() => alert('Open comments')}
          />
        </div>
      </div>
    </div>
  ),
};

export const MultipleBlocks: Story = {
  render: () => (
    <div className="w-[700px] space-y-4">
      <div className="border rounded-lg p-4 hover:bg-muted/50 group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Введение</h3>
            <p className="text-sm text-muted-foreground">
              Начальный блок документа с общей информацией
            </p>
          </div>
          <CommentButton
            blockId="block-1"
            commentCount={0}
            onClick={() => alert('Comments for block 1')}
          />
        </div>
      </div>

      <div className="border rounded-lg p-4 hover:bg-muted/50 group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Основная часть</h3>
            <p className="text-sm text-muted-foreground">
              Здесь находится основное содержание с несколькими комментариями
            </p>
          </div>
          <CommentButton
            blockId="block-2"
            commentCount={7}
            onClick={() => alert('Comments for block 2')}
          />
        </div>
      </div>

      <div className="border rounded-lg p-4 hover:bg-muted/50 group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Заключение</h3>
            <p className="text-sm text-muted-foreground">
              Завершающий блок с выводами
            </p>
          </div>
          <CommentButton
            blockId="block-3"
            commentCount={2}
            onClick={() => alert('Comments for block 3')}
          />
        </div>
      </div>
    </div>
  ),
};

export const AlwaysVisible: Story = {
  render: () => (
    <div className="w-[600px]">
      <div className="border rounded-lg p-4 hover:bg-muted/50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Блок с активными комментариями</h3>
            <p className="text-muted-foreground">
              Кнопка всегда видна (без opacity-0)
            </p>
          </div>
          <div className="opacity-100">
            <CommentButton
              blockId="block-visible"
              commentCount={12}
              onClick={() => alert('Open comments')}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
