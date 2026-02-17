import { CustomField, DocumentFieldValue } from '@shared/types/document.types';
import { Input } from '@ui/input';
import { Textarea } from '@ui/textarea';
import { useState, useEffect, useRef } from 'react';

interface TextFieldInputProps {
  field: CustomField;
  value?: DocumentFieldValue;
  onChange: (value: any) => void;
  type?: 'text' | 'email' | 'tel';
}

export const TextFieldInput = ({ field, value, onChange, type = 'text' }: TextFieldInputProps) => {
  const [localValue, setLocalValue] = useState(value?.value?.text || '');
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isLongText = field.config?.multiline || false;

  useEffect(() => {
    setLocalValue(value?.value?.text || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange({ text: newValue });
    }, 500);
  };

  if (isLongText) {
    return (
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.name}
          {field.is_required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Textarea
          value={localValue}
          onChange={handleChange}
          placeholder={`Enter ${field.name.toLowerCase()}...`}
          className="min-h-[80px]"
        />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {field.name}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Input
        type={type}
        value={localValue}
        onChange={handleChange}
        placeholder={`Enter ${field.name.toLowerCase()}...`}
      />
    </div>
  );
};
