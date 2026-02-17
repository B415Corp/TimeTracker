import type { Meta, StoryObj } from '@storybook/react';
import { CheckboxFieldInput } from './CheckboxFieldInput';
import { CustomField } from '@shared/types/document.types';
import { useState } from 'react';

const meta = {
  title: 'CustomFields/CheckboxFieldInput',
  component: CheckboxFieldInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CheckboxFieldInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockField: CustomField = {
  field_id: 'field-1',
  document_id: 'doc-1',
  name: 'Completed',
  type: 'checkbox',
  is_required: false,
  config: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockRequiredField: CustomField = {
  ...mockField,
  field_id: 'field-2',
  name: 'Accept Terms',
  is_required: true,
};

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<any>();
    return (
      <div className="w-[400px]">
        <CheckboxFieldInput
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
        <CheckboxFieldInput
          field={mockRequiredField}
          value={value}
          onChange={(val) => setValue({ value: val })}
        />
      </div>
    );
  },
};

export const Checked: Story = {
  render: () => {
    const [value, setValue] = useState<any>({ value: { checked: true } });
    return (
      <div className="w-[400px]">
        <CheckboxFieldInput
          field={mockField}
          value={value}
          onChange={(val) => setValue({ value: val })}
        />
      </div>
    );
  },
};

export const FormExample: Story = {
  render: () => {
    const [completed, setCompleted] = useState<any>({ value: { checked: true } });
    const [approved, setApproved] = useState<any>();
    const [published, setPublished] = useState<any>();
    const [archived, setArchived] = useState<any>();

    return (
      <div className="w-[500px] space-y-4 p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Document Status</h3>
        <CheckboxFieldInput
          field={{ ...mockField, name: 'Completed' }}
          value={completed}
          onChange={(val) => setCompleted({ value: val })}
        />
        <CheckboxFieldInput
          field={{ ...mockField, name: 'Approved' }}
          value={approved}
          onChange={(val) => setApproved({ value: val })}
        />
        <CheckboxFieldInput
          field={{ ...mockField, name: 'Published' }}
          value={published}
          onChange={(val) => setPublished({ value: val })}
        />
        <CheckboxFieldInput
          field={{ ...mockField, name: 'Archived' }}
          value={archived}
          onChange={(val) => setArchived({ value: val })}
        />
      </div>
    );
  },
};

export const TaskChecklist: Story = {
  render: () => {
    const [task1, setTask1] = useState<any>({ value: { checked: true } });
    const [task2, setTask2] = useState<any>({ value: { checked: true } });
    const [task3, setTask3] = useState<any>();
    const [task4, setTask4] = useState<any>();

    return (
      <div className="w-[500px] p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Project Checklist</h3>
        <div className="space-y-3">
          <CheckboxFieldInput
            field={{ ...mockField, name: 'Setup development environment' }}
            value={task1}
            onChange={(val) => setTask1({ value: val })}
          />
          <CheckboxFieldInput
            field={{ ...mockField, name: 'Create database schema' }}
            value={task2}
            onChange={(val) => setTask2({ value: val })}
          />
          <CheckboxFieldInput
            field={{ ...mockField, name: 'Implement API endpoints' }}
            value={task3}
            onChange={(val) => setTask3({ value: val })}
          />
          <CheckboxFieldInput
            field={{ ...mockField, name: 'Write unit tests' }}
            value={task4}
            onChange={(val) => setTask4({ value: val })}
          />
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Progress: 2/4 tasks completed
          </p>
        </div>
      </div>
    );
  },
};
