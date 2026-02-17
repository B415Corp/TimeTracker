import type { Meta, StoryObj } from '@storybook/react';
import { DateFieldInput } from './DateFieldInput';
import { CustomField } from '@shared/types/document.types';
import { useState } from 'react';

const meta = {
  title: 'CustomFields/DateFieldInput',
  component: DateFieldInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DateFieldInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockField: CustomField = {
  field_id: 'field-1',
  document_id: 'doc-1',
  name: 'Due Date',
  type: 'date',
  is_required: false,
  config: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockRequiredField: CustomField = {
  ...mockField,
  field_id: 'field-2',
  name: 'Start Date',
  is_required: true,
};

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<any>();
    return (
      <div className="w-[400px]">
        <DateFieldInput
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
        <DateFieldInput
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
    const [value, setValue] = useState<any>({ value: { date: '2024-03-15' } });
    return (
      <div className="w-[400px]">
        <DateFieldInput
          field={mockField}
          value={value}
          onChange={(val) => setValue({ value: val })}
        />
      </div>
    );
  },
};

export const TaskDatesExample: Story = {
  render: () => {
    const [startDate, setStartDate] = useState<any>();
    const [dueDate, setDueDate] = useState<any>();
    const [completedDate, setCompletedDate] = useState<any>({ value: { date: '2024-03-20' } });

    return (
      <div className="w-[500px] space-y-4 p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Task Timeline</h3>
        <DateFieldInput
          field={{ ...mockRequiredField, name: 'Start Date' }}
          value={startDate}
          onChange={(val) => setStartDate({ value: val })}
        />
        <DateFieldInput
          field={{ ...mockRequiredField, name: 'Due Date' }}
          value={dueDate}
          onChange={(val) => setDueDate({ value: val })}
        />
        <DateFieldInput
          field={{ ...mockField, name: 'Completed Date' }}
          value={completedDate}
          onChange={(val) => setCompletedDate({ value: val })}
        />
      </div>
    );
  },
};
