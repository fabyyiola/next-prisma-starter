import React, { ChangeEvent } from 'react';

interface DateInputProps {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  required?: boolean;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function InputDate ({
  label,
  name,
  placeholder,
  value,
  required = false,
  error,
  onChange,
}: DateInputProps) {
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const date = new Date(value);
    const event = {
      target: {
        name: e.target.name,
        value: value,
      },
    } as ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div className="w-full px-2 mb-4">
      <label className="block text-sm font-medium text-gray-700">
        {required && <span className="text-red-500">*</span>} {label}:
      </label>
      <input
        type="date"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleDateChange}
        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
          error ? 'border-red-500' : ''
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
