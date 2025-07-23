'use client';

import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TagsInput({ value, onChange, placeholder = "Add tags...", disabled }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Check if user typed a comma, if so, add the tag
    if (newValue.includes(',')) {
      const tags = newValue.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (tags.length > 0) {
        const lastTag = tags[tags.length - 1];
        // Add all complete tags
        tags.slice(0, -1).forEach(tag => {
          if (!value.includes(tag)) {
            onChange([...value, tag]);
          }
        });
        // Set the last incomplete tag as input value
        setInputValue(lastTag || '');
      } else {
        setInputValue('');
      }
    } else {
      setInputValue(newValue);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[32px] p-2 border border-border rounded-md bg-background">
        {value.map((tag) => (
          <Badge 
            key={tag} 
            variant="secondary" 
            className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-primary/70 hover:text-primary"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
        {!disabled && (
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] border-0 p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            disabled={disabled}
          />
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Press Enter or comma to add tags. Click × to remove.
      </p>
    </div>
  );
}