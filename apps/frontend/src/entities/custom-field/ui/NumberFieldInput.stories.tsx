import type { Meta, StoryObj } from '@storybook/react';
import { NumberFieldInput } from './NumberFieldInput';
import { CustomField } from '@shared/types/document.types';
import { useState } from 'react';

const meta = {
  title: 'CustomFields/NumberFieldInput',
  component: NumberFieldInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NumberFieldInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockField: CustomField = {
  field_id: 'field-1',
  document_id: 'doc-1',
  name: 'Quantity',
  type: 'number',
  is_required: false,
  config: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockRequiredField: CustomField = {
  ...mockField,
  field_id: 'field-2',
  name: 'Price',
  is_required: true,
};

const mockStepField: CustomField = {
  ...mockField,
  field_id: 'field-3',
  name: 'Rating',
  config: { step: 0.5, min: 0, max: 5 },
};

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<any>();
    return (
      <div className="w-[400px]">
        <NumberFieldInput
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
        <NumberFieldInput
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
    const [value, setValue] = useState<any>({ value: { number: 42 } });
    return (
      <div className="w-[400px]">
        <NumberFieldInput
          field={mockField}
          value={value}
          onChange={(val) => setValue({ value: val })}
        />
      </div>
    );
  },
};

export const WithStepAndLimits: Story = {
  render: () => {
    const [value, setValue] = useState<any>({ value: { number: 3.5 } });
    return (
      <div className="w-[400px]">
        <NumberFieldInput
          field={mockStepField}
          value={value}
          onChange={(val) => setValue({ value: val })}
        />
      </div>
    );
  },
};

export const ProductFormExample: Story = {
  render: () => {
    const [price, setPrice] = useState<any>({ value: { number: 99.99 } });
    const [quantity, setQuantity] = useState<any>({ value: { number: 10 } });
    const [discount, setDiscount] = useState<any>({ value: { number: 15 } });

    return (
      <div className="w-[500px] space-y-4 p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Product Details</h3>
        <NumberFieldInput
          field={{
            ...mockRequiredField,
            name: 'Price ($)',
            config: { step: 0.01, min: 0 }
          }}
          value={price}
          onChange={(val) => setPrice({ value: val })}
        />
        <NumberFieldInput
          field={{
            ...mockRequiredField,
            name: 'Quantity',
            config: { step: 1, min: 1 }
          }}
          value={quantity}
          onChange={(val) => setQuantity({ value: val })}
        />
        <NumberFieldInput
          field={{
            ...mockField,
            name: 'Discount (%)',
            config: { step: 1, min: 0, max: 100 }
          }}
          value={discount}
          onChange={(val) => setDiscount({ value: val })}
        />
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Total: ${((price?.value?.number || 0) * (quantity?.value?.number || 0) * (1 - (discount?.value?.number || 0) / 100)).toFixed(2)}
          </p>
        </div>
      </div>
    );
  },
};
