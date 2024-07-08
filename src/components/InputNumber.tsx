import React, { ChangeEvent } from 'react';

interface NumberInputProps {
  label: string;
  name: string;
  placeholder: string;
  value: number;
  required?: boolean;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function InputNumber ({
  label,
  name,
  placeholder,
  value,
  required = false,
  error,
  onChange,
}:NumberInputProps) {
  return (
    <div className="w-full px-2 mb-4">
      <label className="block text-sm font-medium text-gray-700">
        {required && <span className="text-red-500">*</span>} {label}:
      </label>
      <input
        type="number"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
          error ? 'border-red-500' : ''
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
