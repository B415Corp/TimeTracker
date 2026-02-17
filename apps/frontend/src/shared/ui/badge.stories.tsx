import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';
import { CheckCircle2, XCircle } from 'lucide-react';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <CheckCircle2 />
        Success
      </>
    ),
  },
};

export const WithErrorIcon: Story = {
  args: {
    children: (
      <>
        <XCircle />
        Error
      </>
    ),
    variant: 'destructive',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">
        <CheckCircle2 />
        Active
      </Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">
        <XCircle />
        Failed
      </Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  ),
};
