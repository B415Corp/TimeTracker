import { CustomField, DocumentFieldValue } from '@shared/types/document.types';
import { Input } from '@ui/input';
import { ExternalLink, Globe } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface UrlFieldInputProps {
  field: CustomField;
  value?: DocumentFieldValue;
  onChange: (value: any) => void;
}

export const UrlFieldInput = ({ field, value, onChange }: UrlFieldInputProps) => {
  const [localValue, setLocalValue] = useState(value?.value?.url || '');
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setLocalValue(value?.value?.url || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange({ url: newValue });
    }, 500);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {field.name}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <Input
          type="url"
          value={localValue}
          onChange={handleChange}
          placeholder="https://example.com"
          className="pl-10"
        />
        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        {localValue && isValidUrl(localValue) && (
          <a
            href={localValue}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 hover:text-blue-700"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};
