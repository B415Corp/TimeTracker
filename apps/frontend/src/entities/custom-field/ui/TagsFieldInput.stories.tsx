import type { Meta, StoryObj } from '@storybook/react';
import { TagsFieldInput } from './TagsFieldInput';
import { CustomField } from '@shared/types/document.types';
import { useState } from 'react';

const meta = {
  title: 'CustomFields/TagsFieldInput',
  component: TagsFieldInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TagsFieldInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockField: CustomField = {
  field_id: 'field-1',
  document_id: 'doc-1',
  name: 'Tags',
  type: 'tags',
  is_required: false,
  config: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockRequiredField: CustomField = {
  ...mockField,
  field_id: 'field-2',
  name: 'Keywords',
  is_required: true,
};

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<any>();
    return (
      <div className="w-[500px]">
        <TagsFieldInput
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
      <div className="w-[500px]">
        <TagsFieldInput
          field={mockRequiredField}
          value={value}
          onChange={(val) => setValue({ value: val })}
        />
      </div>
    );
  },
};

export const WithTags: Story = {
  render: () => {
    const [value, setValue] = useState<any>({
      value: { tags: ['React', 'TypeScript', 'Storybook'] }
    });
    return (
      <div className="w-[500px]">
        <TagsFieldInput
          field={mockField}
          value={value}
          onChange={(val) => setValue({ value: val })}
        />
      </div>
    );
  },
};

export const ManyTags: Story = {
  render: () => {
    const [value, setValue] = useState<any>({
      value: {
        tags: [
          'Frontend',
          'Backend',
          'API',
          'Database',
          'Authentication',
          'Testing',
          'Documentation',
          'Deployment',
        ]
      }
    });
    return (
      <div className="w-[600px]">
        <TagsFieldInput
          field={mockField}
          value={value}
          onChange={(val) => setValue({ value: val })}
        />
      </div>
    );
  },
};

export const ArticleMetadataExample: Story = {
  render: () => {
    const [tags, setTags] = useState<any>({
      value: { tags: ['Tutorial', 'JavaScript'] }
    });
    const [keywords, setKeywords] = useState<any>({
      value: { tags: ['web development', 'programming'] }
    });

    return (
      <div className="w-[600px] space-y-4 p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Article Metadata</h3>
        <TagsFieldInput
          field={{ ...mockField, name: 'Tags' }}
          value={tags}
          onChange={(val) => setTags({ value: val })}
        />
        <TagsFieldInput
          field={{ ...mockRequiredField, name: 'SEO Keywords' }}
          value={keywords}
          onChange={(val) => setKeywords({ value: val })}
        />
        <div className="pt-4 border-t text-sm text-muted-foreground">
          <p>Tip: Press Enter to add a tag</p>
        </div>
      </div>
    );
  },
};
