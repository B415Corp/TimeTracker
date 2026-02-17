import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Type your message here...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'This is some text content in the textarea.',
    placeholder: 'Type your message here...',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'This textarea is disabled',
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <label htmlFor="message" className="text-sm font-medium">
        Your message
      </label>
      <Textarea id="message" placeholder="Type your message here..." />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="w-[500px] space-y-4">
      <div className="space-y-2">
        <label htmlFor="feedback" className="text-sm font-medium">
          Feedback
        </label>
        <Textarea
          id="feedback"
          placeholder="Please share your feedback..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Your feedback helps us improve our service.
        </p>
      </div>
    </div>
  ),
};

export const CharacterCount: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    const maxLength = 200;

    return (
      <div className="w-[400px] space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength}
        />
        <p className="text-xs text-muted-foreground text-right">
          {value.length}/{maxLength}
        </p>
      </div>
    );
  },
};
