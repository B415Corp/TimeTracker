import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta = {
  title: 'UI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-[400px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-[200px] items-center space-x-4">
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Item 1</h4>
        <p className="text-sm text-muted-foreground">Description 1</p>
      </div>
      <Separator orientation="vertical" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Item 2</h4>
        <p className="text-sm text-muted-foreground">Description 2</p>
      </div>
      <Separator orientation="vertical" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Item 3</h4>
        <p className="text-sm text-muted-foreground">Description 3</p>
      </div>
    </div>
  ),
};

export const InMenu: Story = {
  render: () => (
    <div className="w-[250px] border rounded-lg p-2">
      <div className="px-2 py-1.5 text-sm font-semibold">My Account</div>
      <Separator className="my-1" />
      <div className="space-y-1">
        <div className="px-2 py-1.5 text-sm hover:bg-accent rounded cursor-pointer">
          Profile
        </div>
        <div className="px-2 py-1.5 text-sm hover:bg-accent rounded cursor-pointer">
          Settings
        </div>
        <div className="px-2 py-1.5 text-sm hover:bg-accent rounded cursor-pointer">
          Billing
        </div>
      </div>
      <Separator className="my-1" />
      <div className="px-2 py-1.5 text-sm hover:bg-accent rounded cursor-pointer text-destructive">
        Logout
      </div>
    </div>
  ),
};

export const InList: Story = {
  render: () => (
    <div className="w-[350px] space-y-3">
      <div>
        <h3 className="font-semibold">Item 1</h3>
        <p className="text-sm text-muted-foreground">
          This is the first item in the list.
        </p>
      </div>
      <Separator />
      <div>
        <h3 className="font-semibold">Item 2</h3>
        <p className="text-sm text-muted-foreground">
          This is the second item in the list.
        </p>
      </div>
      <Separator />
      <div>
        <h3 className="font-semibold">Item 3</h3>
        <p className="text-sm text-muted-foreground">
          This is the third item in the list.
        </p>
      </div>
    </div>
  ),
};
