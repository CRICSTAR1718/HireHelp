import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  examples?: string[];
  required?: boolean;
}

export const TagInput: React.FC<TagInputProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Type and press Enter to add',
  examples = [],
  required = false,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const addExample = (example: string) => {
    if (!value.includes(example)) {
      onChange([...value, example]);
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="flex flex-wrap gap-2">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200 shadow-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-blue-900 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
        />
      </div>

      {examples.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium text-slate-500 mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addExample(example)}
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors"
              >
                <Plus className="w-3 h-3" strokeWidth={2} />
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
