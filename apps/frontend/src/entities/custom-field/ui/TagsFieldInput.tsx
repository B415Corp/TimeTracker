import { CustomField, DocumentFieldValue } from '@shared/types/document.types';
import { Input } from '@ui/input';
import { Badge } from '@ui/badge';
import { X, Plus } from 'lucide-react';
import { useState, useEffect, KeyboardEvent } from 'react';

interface TagsFieldInputProps {
  field: CustomField;
  value?: DocumentFieldValue;
  onChange: (value: any) => void;
}

export const TagsFieldInput = ({ field, value, onChange }: TagsFieldInputProps) => {
  const [tags, setTags] = useState<string[]>(value?.value?.tags || []);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setTags(value?.value?.tags || []);
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        const updated = [...tags, newTag];
        setTags(updated);
        onChange({ tags: updated });
      }
      setInputValue('');
    }
  };

  const handleRemove = (tagToRemove: string) => {
    const updated = tags.filter((t) => t !== tagToRemove);
    setTags(updated);
    onChange({ tags: updated });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {field.name}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                onClick={() => handleRemove(tag)}
                className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press Enter to add tag..."
        />
        <Plus className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};
