import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

// Professional Dropdown Component
export const ProfessionalDropdown = ({ options, onSelect, placeholder, icon: Icon }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options?.filter((option: any) => option?.label?.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelect = (value: any) => {
    onSelect(value);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-3 transition hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
      >
        <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          {Icon && <Icon size={18} />}
          {placeholder}
        </span>
        <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No items found</div>
              ) : (
                filteredOptions.map((option: any) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className="w-full cursor-pointer px-4 py-3 text-left text-sm capitalize transition hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
