import { CustomField, DocumentFieldValue } from '@shared/types/document.types';
import { Input } from '@ui/input';
import { Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DateFieldInputProps {
  field: CustomField;
  value?: DocumentFieldValue;
  onChange: (value: any) => void;
}

export const DateFieldInput = ({ field, value, onChange }: DateFieldInputProps) => {
  const [localValue, setLocalValue] = useState(value?.value?.date || '');

  useEffect(() => {
    setLocalValue(value?.value?.date || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange({ date: newValue });
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {field.name}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <Input
          type="date"
          value={localValue}
          onChange={handleChange}
          className="pl-10"
        />
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};
