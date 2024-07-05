import React, { useState, ChangeEvent, ReactElement, ReactNode } from 'react';
import { Modal } from './Modal';

export interface Option {
  text: string;
  value: string;
}

interface InputNewSearchProps {
  label: string | ReactNode; // Update label prop type
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  newNode: ReactElement; // Change this to ReactElement
  newModalTitle?: string;
  onNewSuccess?: () => void; // Add this prop
  error?: string; // Add error prop
}

export default function InputNewSearch({
  label,
  name,
  value,
  onChange,
  options,
  newNode,
  newModalTitle = 'Agregar registro',
  onNewSuccess = () => {},
  error // Add error prop
}: InputNewSearchProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleModal = (value?: boolean) => {
    if (value) setIsOpen(value);
    else setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          {label}:
        </label>
        <div className="flex mt-1">
          <button
            onClick={() => {
              handleModal();
            }}
            type="button"
            className="px-4 py-2 bg-teal-500 text-white rounded-l-md hover:bg-teal-600 focus:outline-none"
          >
            New
          </button>
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`flex-grow px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
              error ? 'border-red-500' : ''
            } rounded-r-md`}
          >
            <option value="">Seleccione</option> {/* Ensure value is an empty string */}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <Modal
        headerText={newModalTitle}
        size={'md'}
        isOpen={isOpen}
        handleOpen={(val?: boolean) => {
          handleModal(val);
        }}
      >
        {React.cloneElement(newNode, {
          onSuccess: () => {
            handleModal(false);
            onNewSuccess();
          },
        })}
      </Modal>
    </>
  );
}
