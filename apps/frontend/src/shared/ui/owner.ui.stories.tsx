import type { Meta, StoryObj } from '@storybook/react';
import OwnerUi from './owner.ui';
import { Avatar, AvatarFallback } from './avatar';

const meta = {
  title: 'Shared/OwnerUi',
  component: OwnerUi,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OwnerUi>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IsOwner: Story = {
  args: {
    isOwner: true,
  },
};

export const NotOwner: Story = {
  args: {
    isOwner: false,
  },
};

export const InUserList: Story = {
  render: () => (
    <div className="space-y-3 w-[400px]">
      <div className="flex items-center justify-between p-3 border rounded">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>АИ</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Алексей Иванов</p>
            <p className="text-xs text-muted-foreground">alexey@example.com</p>
          </div>
        </div>
        <OwnerUi isOwner={true} />
      </div>
      <div className="flex items-center justify-between p-3 border rounded">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>МП</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Мария Петрова</p>
            <p className="text-xs text-muted-foreground">maria@example.com</p>
          </div>
        </div>
        <OwnerUi isOwner={false} />
      </div>
      <div className="flex items-center justify-between p-3 border rounded">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>ИС</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Иван Сидоров</p>
            <p className="text-xs text-muted-foreground">ivan@example.com</p>
          </div>
        </div>
        <OwnerUi isOwner={false} />
      </div>
    </div>
  ),
};

export const InDocumentHeader: Story = {
  render: () => (
    <div className="w-[600px] p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Project Documentation</h2>
        <OwnerUi isOwner={true} />
      </div>
      <p className="text-muted-foreground">
        This is your document. You have full access to edit and manage it.
      </p>
    </div>
  ),
};
