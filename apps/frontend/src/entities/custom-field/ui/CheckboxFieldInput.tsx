import { CustomField, DocumentFieldValue } from '@shared/types/document.types';
import { Checkbox } from '@ui/checkbox';
import { Label } from '@ui/label';
import { useState, useEffect } from 'react';

interface CheckboxFieldInputProps {
  field: CustomField;
  value?: DocumentFieldValue;
  onChange: (value: any) => void;
}

export const CheckboxFieldInput = ({ field, value, onChange }: CheckboxFieldInputProps) => {
  const [checked, setChecked] = useState(value?.value?.checked || false);

  useEffect(() => {
    setChecked(value?.value?.checked || false);
  }, [value]);

  const handleChange = (newChecked: boolean) => {
    setChecked(newChecked);
    onChange({ checked: newChecked });
  };

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={field.field_id}
        checked={checked}
        onCheckedChange={handleChange}
      />
      <Label htmlFor={field.field_id} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
        {field.name}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </Label>
    </div>
  );
};
