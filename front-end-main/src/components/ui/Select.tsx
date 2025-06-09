// src/components/ui/Select.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: Option[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Pilih opsi...',
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className={cn('relative', className)}>
      {/* Select Button */}
      <button
        type='button'
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-3 rounded-xl border-2 border-gray-200',
          'bg-white text-left text-gray-900',
          'focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100',
          'transition-all duration-200',
          'flex items-center justify-between gap-2',
          'shadow-sm hover:shadow-md',
          disabled && 'opacity-50 cursor-not-allowed',
          isOpen && 'border-blue-500 ring-4 ring-blue-100'
        )}
      >
        <span className={cn('truncate', !selectedOption && 'text-gray-500')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 w-full mt-2 bg-white border border-gray-200',
            'rounded-xl shadow-lg overflow-hidden',
            'animate-fade-in-up'
          )}
        >
          <div className='max-h-60 overflow-y-auto'>
            {options.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => handleOptionClick(option.value)}
                className={cn(
                  'w-full px-4 py-3 text-left hover:bg-blue-50',
                  'transition-colors duration-150',
                  'flex items-center justify-between',
                  option.value === value && 'bg-blue-50 text-blue-600'
                )}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className='w-4 h-4 text-blue-600' />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
