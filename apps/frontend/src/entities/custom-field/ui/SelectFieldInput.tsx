import { CustomField, DocumentFieldValue } from '@shared/types/document.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select';
import { Badge } from '@ui/badge';
import { X } from 'lucide-react';
import { useState } from 'react';

interface SelectFieldInputProps {
  field: CustomField;
  value?: DocumentFieldValue;
  onChange: (value: any) => void;
  isMulti?: boolean;
}

export const SelectFieldInput = ({ field, value, onChange, isMulti = false }: SelectFieldInputProps) => {
  const options = field.config?.options || [];
  const selectedValue = isMulti ? (value?.value?.selected || []) : (value?.value?.selected || '');
  const [multiValues, setMultiValues] = useState<string[]>(Array.isArray(selectedValue) ? selectedValue : []);

  const handleSelect = (newValue: string) => {
    if (isMulti) {
      const updated = multiValues.includes(newValue)
        ? multiValues.filter((v) => v !== newValue)
        : [...multiValues, newValue];
      setMultiValues(updated);
      onChange({ selected: updated });
    } else {
      onChange({ selected: newValue });
    }
  };

  const handleRemove = (valueToRemove: string) => {
    const updated = multiValues.filter((v) => v !== valueToRemove);
    setMultiValues(updated);
    onChange({ selected: updated });
  };

  if (isMulti) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.name}
          {field.is_required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {multiValues.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {multiValues.map((val) => (
              <Badge key={val} variant="secondary" className="gap-1">
                {val}
                <button
                  onClick={() => handleRemove(val)}
                  className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        
        <Select onValueChange={handleSelect}>
          <SelectTrigger>
            <SelectValue placeholder={`Select ${field.name.toLowerCase()}...`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {field.name}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Select value={selectedValue as string} onValueChange={handleSelect}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${field.name.toLowerCase()}...`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option: string) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
