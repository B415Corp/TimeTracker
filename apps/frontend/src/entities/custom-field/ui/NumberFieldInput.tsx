import { CustomField, DocumentFieldValue } from '@shared/types/document.types';
import { Input } from '@ui/input';
import { useState, useEffect, useRef } from 'react';

interface NumberFieldInputProps {
  field: CustomField;
  value?: DocumentFieldValue;
  onChange: (value: any) => void;
}

export const NumberFieldInput = ({ field, value, onChange }: NumberFieldInputProps) => {
  const [localValue, setLocalValue] = useState(value?.value?.number?.toString() || '');
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setLocalValue(value?.value?.number?.toString() || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const numValue = parseFloat(newValue);
      onChange({ number: isNaN(numValue) ? null : numValue });
    }, 500);
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {field.name}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Input
        type="number"
        value={localValue}
        onChange={handleChange}
        placeholder={`Enter ${field.name.toLowerCase()}...`}
        step={field.config?.step || 1}
        min={field.config?.min}
        max={field.config?.max}
      />
    </div>
  );
};
