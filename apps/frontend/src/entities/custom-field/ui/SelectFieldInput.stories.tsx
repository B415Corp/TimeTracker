import type { Meta, StoryObj } from '@storybook/react';
import { SelectFieldInput } from './SelectFieldInput';
import { CustomField } from '@shared/types/document.types';
import { useState } from 'react';

const meta = {
  title: 'CustomFields/SelectFieldInput',
  component: SelectFieldInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SelectFieldInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockField: CustomField = {
  field_id: 'field-1',
  document_id: 'doc-1',
  name: 'Status',
  type: 'select',
  is_required: false,
  config: {
    options: ['Todo', 'In Progress', 'Review', 'Done']
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockRequiredField: CustomField = {
  ...mockField,
  field_id: 'field-2',
  name: 'Priority',
  is_required: true,
  config: {
    options: ['Low', 'Medium', 'High', 'Critical']
  },
};

const mockCategoryField: CustomField = {
  ...mockField,
  field_id: 'field-3',
  name: 'Category',
  config: {
    options: ['Bug', 'Feature', 'Improvement', 'Documentation', 'Question']
  },
};

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<any>();
    return (
      <div className="w-[400px]">
        <SelectFieldInput
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
        <SelectFieldInput
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
    const [value, setValue] = useState<any>({ value: { selected: 'In Progress' } });
    return (
      <div className="w-[400px]">
        <SelectFieldInput
          field={mockField}
          value={value}
          onChange={(val) => setValue({ value: val })}
        />
      </div>
    );
  },
};

export const MultiSelect: Story = {
  render: () => {
    const [value, setValue] = useState<any>();
    return (
      <div className="w-[400px]">
        <SelectFieldInput
          field={mockCategoryField}
          value={value}
          onChange={(val) => setValue({ value: val })}
          isMulti
        />
      </div>
    );
  },
};

export const MultiSelectWithValues: Story = {
  render: () => {
    const [value, setValue] = useState<any>({ value: { selected: ['Bug', 'Feature'] } });
    return (
      <div className="w-[400px]">
        <SelectFieldInput
          field={mockCategoryField}
          value={value}
          onChange={(val) => setValue({ value: val })}
          isMulti
        />
      </div>
    );
  },
};

export const TaskFormExample: Story = {
  render: () => {
    const [status, setStatus] = useState<any>({ value: { selected: 'Todo' } });
    const [priority, setPriority] = useState<any>({ value: { selected: 'Medium' } });
    const [categories, setCategories] = useState<any>({ value: { selected: ['Feature'] } });

    return (
      <div className="w-[500px] space-y-4 p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Task Properties</h3>
        <SelectFieldInput
          field={mockField}
          value={status}
          onChange={(val) => setStatus({ value: val })}
        />
        <SelectFieldInput
          field={mockRequiredField}
          value={priority}
          onChange={(val) => setPriority({ value: val })}
        />
        <SelectFieldInput
          field={{ ...mockCategoryField, name: 'Labels' }}
          value={categories}
          onChange={(val) => setCategories({ value: val })}
          isMulti
        />
      </div>
    );
  },
};
