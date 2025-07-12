'use client';

import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface SkillTagsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
}

export function SkillTagsInput({ value, onChange, placeholder }: SkillTagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddSkill = () => {
    const newSkill = inputValue.trim();
    if (newSkill && !value.includes(newSkill)) {
      onChange([...value, newSkill]);
      setInputValue('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(value.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Type a skill and press Enter"}
        />
        <Button type="button" onClick={handleAddSkill}>Add</Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {value.map((skill, index) => (
          <Badge key={index} variant="secondary" className="text-base py-1 pl-3 pr-2">
            {skill}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              <span className="sr-only">Remove {skill}</span>
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
