import { useState, useEffect, ChangeEvent } from 'react';
import {
  createDireccion,
  updateDireccion,
  deleteDireccion,
} from '@/apiCalls/direccionApi';
import { Direccion } from '@/types/schema.types';

interface DireccionFormProps {
  onSuccess?: (data: Direccion | unknown) => void;
  onError?: (error: string) => void;
  direccion?: Direccion | null;
}

export default function DireccionForm({
  onSuccess,
  onError,
  direccion = null,
}: DireccionFormProps) {
  const [formData, setFormData] = useState<Direccion>({
    ID: NaN,
    Nombre: '',
    Calle: '',
    Ciudad: '',
    Estado: '',
    CodigoPostal: '',
    Referencias: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const requiredFields = ['Nombre', 'Calle', 'Ciudad', 'Estado', 'CodigoPostal'];

  useEffect(() => {
    if (direccion) {
      console.log('Setting direccion data:', direccion);
      setFormData(direccion);
    }
  }, [direccion]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error message when user starts typing
  };

  const handleDelete = async () => {
    try {
      if (direccion && direccion.ID) {
        console.log('Deleting direccion with ID:', direccion.ID);
        await deleteDireccion(direccion.ID);
        if (onSuccess) {
          onSuccess(direccion.ID);
        }
      } else {
        throw 'Unhandled error: Direccion ID is missing';
      }
    } catch (error) {
      console.error('Error deleting direccion:', error);
      if (onError) {
        onError(`Error deleting direccion: ${error}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from propagating to the parent form

    console.log('Form submitted with data:', formData);

    const newErrors: { [key: string]: string } = {};

    requiredFields.forEach((field) => {
      if (!formData[field as keyof Direccion]) {
        newErrors[field] = `${field} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      console.log('Validation errors:', newErrors);
      setErrors(newErrors);
      return;
    }

    try {
      let response: Direccion | unknown = undefined;
      if (direccion) {
        console.log('Updating direccion with data:', formData);
        response = await updateDireccion(formData.ID, formData);
      } else {
        console.log('Creating new direccion with data:', formData);
        response = await createDireccion(formData);
      }
      if (onSuccess) {
        console.log('Operation successful, response:', response);
        onSuccess(response);
      }
    } catch (error) {
      console.error('Unhandled error:', error);
      if (onError) {
        onError(`Unhandled error: ${error}`);
      }
    }
  };

  return (
    <div className="mx-auto bg-white rounded-md">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-2">
          {[
            { label: 'Nombre', placeholder: 'Nombre', name: 'Nombre', type: 'text' },
            { label: 'Calle', placeholder: 'Calle', name: 'Calle', type: 'text' },
            { label: 'Ciudad', placeholder: 'Ciudad', name: 'Ciudad', type: 'text' },
            { label: 'Estado', placeholder: 'Estado', name: 'Estado', type: 'text' },
            { label: 'Codigo Postal', placeholder: 'Codigo Postal', name: 'CodigoPostal', type: 'text' },
            { label: 'Referencias', placeholder: 'Referencias', name: 'Referencias', type: 'text' },
          ].map(({ label, placeholder, name, type }) => (
            <div key={name} className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {requiredFields.includes(name) && <span className="text-red-500">*</span>} {label}:
              </label>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name as keyof Direccion] ?? ''}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                  errors[name] ? 'border-red-500' : ''
                }`}
              />
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4">
          {direccion && (
            <>
              <button
                onClick={handleDelete}
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
              >
                Eliminar
              </button>
            </>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none"
          >
            {direccion ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
