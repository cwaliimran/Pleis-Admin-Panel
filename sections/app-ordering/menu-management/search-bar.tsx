import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative min-w-[250px] flex-1 bg-white dark:bg-[#222121]">
      <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
      <Input
        type="text"
        placeholder="Search menu items..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 border border-gray-200 pl-11 focus:border-blue-600 dark:border-gray-700 dark:focus:border-blue-400"
      />
    </div>
  );
};
