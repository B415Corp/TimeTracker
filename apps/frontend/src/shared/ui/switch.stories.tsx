import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

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
      <Switch id="airplane-mode" />
      <label
        htmlFor="airplane-mode"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Airplane Mode
      </label>
    </div>
  ),
};

export const SettingsExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label htmlFor="notifications" className="text-sm font-medium">
            Notifications
          </label>
          <p className="text-xs text-muted-foreground">
            Receive notifications about your account activity
          </p>
        </div>
        <Switch id="notifications" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label htmlFor="marketing" className="text-sm font-medium">
            Marketing emails
          </label>
          <p className="text-xs text-muted-foreground">
            Receive emails about new products and features
          </p>
        </div>
        <Switch id="marketing" />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label htmlFor="security" className="text-sm font-medium">
            Security alerts
          </label>
          <p className="text-xs text-muted-foreground">
            Get notified about security issues
          </p>
        </div>
        <Switch id="security" defaultChecked />
      </div>
    </div>
  ),
};
