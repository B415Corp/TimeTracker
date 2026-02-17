import type { Meta, StoryObj } from '@storybook/react';
import { TextFieldInput } from './TextFieldInput';
import { CustomField } from '@shared/types/document.types';
import { useState } from 'react';

const meta = {
  title: 'CustomFields/TextFieldInput',
  component: TextFieldInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TextFieldInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockField: CustomField = {
  field_id: 'field-1',
  document_id: 'doc-1',
  name: 'Description',
  type: 'text',
  is_required: false,
  config: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockRequiredField: CustomField = {
  ...mockField,
  field_id: 'field-2',
  name: 'Title',
  is_required: true,
};

const mockMultilineField: CustomField = {
  ...mockField,
  field_id: 'field-3',
  name: 'Long Description',
  config: { multiline: true },
};

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<any>();
    return (
      <div className="w-[400px]">
        <TextFieldInput
          field={mockField}
          value={value}
          onChange={(val) => setValue({ value: val })}
        />
      </div>
    );
  },
};

export const Required: Story = {
  render: () => {
    const [value, setValue] = useState<any>();
    return (
      <div className="w-[400px]">
        <TextFieldInput
          field={mockRequiredField}
          value={value}
          onChange={(val) => setValue({ value: val })}
        />
      </div>
    );
  },
};

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState<any>({ value: { text: 'Sample text content' } });
    return (
      <div className="w-[400px]">
        <TextFieldInput
          field={mockField}
          value={value}
          onChange={(val) => setValue({ value: val })}
        />
      </div>
    );
  },
};

export const Multiline: Story = {
  render: () => {
    const [value, setValue] = useState<any>();
    return (
      <div className="w-[400px]">
        <TextFieldInput
          field={mockMultilineField}
          value={value}
          onChange={(val) => setValue({ value: val })}
        />
      </div>
    );
  },
};

export const MultilineWithValue: Story = {
  render: () => {
    const [value, setValue] = useState<any>({
      value: { text: 'This is a longer text that spans multiple lines.\n\nIt can contain paragraphs and detailed information.' }
    });
    return (
      <div className="w-[400px]">
        <TextFieldInput
          field={mockMultilineField}
          value={value}
          onChange={(val) => setValue({ value: val })}
        />
      </div>
    );
  },
};

export const Email: Story = {
  render: () => {
    const [value, setValue] = useState<any>();
    const emailField = { ...mockField, name: 'Email' };
    return (
      <div className="w-[400px]">
        <TextFieldInput
          field={emailField}
          value={value}
          onChange={(val) => setValue({ value: val })}
          type="email"
        />
      </div>
    );
  },
};

export const FormExample: Story = {
  render: () => {
    const [name, setName] = useState<any>();
    const [email, setEmail] = useState<any>();
    const [bio, setBio] = useState<any>();

    return (
      <div className="w-[500px] space-y-4 p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">User Profile Form</h3>
        <TextFieldInput
          field={{ ...mockRequiredField, name: 'Name' }}
          value={name}
          onChange={(val) => setName({ value: val })}
        />
        <TextFieldInput
          field={{ ...mockRequiredField, name: 'Email' }}
          value={email}
          onChange={(val) => setEmail({ value: val })}
          type="email"
        />
        <TextFieldInput
          field={{ ...mockMultilineField, name: 'Bio' }}
          value={bio}
          onChange={(val) => setBio({ value: val })}
        />
      </div>
    );
  },
};
