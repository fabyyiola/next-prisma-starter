import { useState, ChangeEvent } from 'react';
import { createClient } from "@/apiCalls";
import { Cliente } from '@/types/schema.types';
import InputNewSearch from '../InputNewSearch';

interface ClientFormProps {
  onSuccess?: (data: Cliente) => void;
  onError?: (error: any) => void;
}

export default function ClientForm({ onSuccess, onError }: ClientFormProps) {
  const [formData, setFormData] = useState<Cliente>({
    Nombre: '',
    Calle: '',
    Ciudad: '',
    Estado: '',
    CodigoPostal: '',
    RFC: '',
    RegimenFiscal: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createClient(formData);
      console.log('Client created successfully:', response);
      if (onSuccess) {
        onSuccess(formData);
      }
    } catch (error) {
      console.error('Error creating client:', error);
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <div className="mx-auto bg-white rounded-md">
      <form onSubmit={handleSubmit}>
        {[
          { label: 'Nombre', placeholder: 'Nombre', name: 'Nombre', type: 'text' },
          { label: 'Calle y num', placeholder: 'Calle y num', name: 'Calle', type: 'text' },
          { label: 'Ciudad', placeholder: 'Ciudad', name: 'Ciudad', type: 'text' },
          { label: 'Estado', placeholder: 'Estado', name: 'Estado', type: 'text' },
          { label: 'Codigo Postal', placeholder: 'Codigo Postal', name: 'CodigoPostal', type: 'text' },
          { label: 'RFC', placeholder: 'RFC', name: 'RFC', type: 'text' },
        ].map(({ label, placeholder, name, type }) => (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              <span className="text-red-500">*</span> {label}:
            </label>
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name as keyof Cliente]}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        ))}
        <InputNewSearch
          label="Regimen fiscal"
          placeholder="RESICO, Serv. Profesionales, etc"
          name="RegimenFiscal"
          value={formData.RegimenFiscal}
          onChange={handleChange}
        />
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
          >
            Desactivar
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
          >
            Eliminar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
