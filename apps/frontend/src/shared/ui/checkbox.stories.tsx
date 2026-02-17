import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="feature1" defaultChecked />
        <label htmlFor="feature1" className="text-sm">
          Enable feature 1
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="feature2" />
        <label htmlFor="feature2" className="text-sm">
          Enable feature 2
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="feature3" />
        <label htmlFor="feature3" className="text-sm">
          Enable feature 3
        </label>
      </div>
    </div>
  ),
};
