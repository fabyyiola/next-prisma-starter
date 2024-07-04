import React, { useState, ChangeEvent, ReactNode, ReactElement } from 'react'
import { Modal } from './Modal'

export interface Option {
  text: string
  value: string
}

interface InputNewSearchProps {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  options: Option[]
  newNode: ReactElement // Change this to ReactElement
  searchNode: ReactNode
  newModalTitle?: string
  searchModalTitle?: string
  onNewSuccess?: () => void // Add this prop
}

export default function InputNewSearch({
  label,
  name,
  value,
  onChange,
  options,
  newNode,
  searchNode,
  newModalTitle = 'Agregar registro',
  searchModalTitle = 'Buscar registro',
  onNewSuccess = ()=>{}, 
}: InputNewSearchProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [btnClicked, setBtnClicked] = useState<'new' | 'search' | undefined>(undefined)
  
  const handleModal = (value?: boolean) => {
    if (value) setIsOpen(value)
    else setIsOpen(!isOpen)
  }

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          <span className="text-red-500">*</span> {label}:
        </label>
        <div className="flex mt-1">
          <button
            onClick={() => {
              setBtnClicked('new')
              handleModal()
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
            className="flex-grow px-3 py-2 border-t border-b border-gray-300 shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setBtnClicked('search')
              handleModal()
            }}
            type="button"
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400 focus:outline-none"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 4h13M8 12h9m-9 8h13M3 8h.01M3 16h.01"
              />
            </svg>
          </button>
        </div>
      </div>
      <Modal
        headerText={btnClicked === 'new' ? newModalTitle : searchModalTitle}
        size={'md'}
        isOpen={isOpen}
        handleOpen={(val?: boolean) => { handleModal(val) }}
      >
        {btnClicked === 'new' ? React.cloneElement(newNode, { onSuccess: () => { handleModal(false); onNewSuccess(); } }) : searchNode}
      </Modal>
    </>
  )
}
