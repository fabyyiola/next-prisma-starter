import { useState, useEffect, ChangeEvent } from 'react';
import {
  createUnidad,
  updateUnidad,
  deleteUnidad,
} from '@/apiCalls/unidadApi';
import { Unidad } from '@/types/schema.types';

interface UnidadFormProps {
  onSuccess?: (data: Unidad | unknown) => void;
  onError?: (error: string) => void;
  unidad?: Unidad | null;
}

export default function UnidadForm({
  onSuccess,
  onError,
  unidad = null,
}: UnidadFormProps) {
  const [formData, setFormData] = useState<Unidad>({
    ID: NaN,
    NoEconomico: 0,
    Placas: '',
    Marca: '',
    Modelo: '',
    Tipo: '',
    VerMecanica: new Date(),
    VerContaminantes: new Date(),
    VerUS: new Date(),
    PolizaUS: new Date(),
    PolizaMX: new Date(),
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const requiredFields = ['NoEconomico', 'Placas', 'Marca', 'Modelo', 'Tipo', 'VerMecanica', 'VerContaminantes', 'VerUS', 'PolizaUS', 'PolizaMX'];

  useEffect(() => {
    if (unidad) {
      console.log('Setting unidad data:', unidad);
      setFormData(unidad);
    }
  }, [unidad]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setFormData({ ...formData, [name]: name === 'NoEconomico' ? parseInt(value) : value });
    setErrors({ ...errors, [name]: '' }); // Clear error message when user starts typing
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setFormData({ ...formData, [name]: new Date(value) });
    setErrors({ ...errors, [name]: '' }); // Clear error message when user starts typing
  };

  const handleDelete = async () => {
    try {
      if (unidad && unidad.ID) {
        console.log('Deleting unidad with ID:', unidad.ID);
        await deleteUnidad(unidad.ID);
        if (onSuccess) {
          onSuccess(unidad.ID);
        }
      } else {
        throw 'Unhandled error: Unidad ID is missing';
      }
    } catch (error) {
      console.error('Error deleting unidad:', error);
      if (onError) {
        onError(`Error deleting unidad: ${error}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from propagating to the parent form

    console.log('Form submitted with data:', formData);

    const newErrors: { [key: string]: string } = {};

    requiredFields.forEach((field) => {
      if (!formData[field as keyof Unidad]) {
        newErrors[field] = `${field} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      console.log('Validation errors:', newErrors);
      setErrors(newErrors);
      return;
    }

    try {
      let response: Unidad | unknown = undefined;
      if (unidad) {
        console.log('Updating unidad with data:', formData);
        response = await updateUnidad(formData.ID, formData);
      } else {
        console.log('Creating new unidad with data:', formData);
        response = await createUnidad(formData);
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
            { label: 'No Economico', placeholder: 'No Economico', name: 'NoEconomico', type: 'number' },
            { label: 'Placas', placeholder: 'Placas', name: 'Placas', type: 'text' },
            { label: 'Marca', placeholder: 'Marca', name: 'Marca', type: 'text' },
            { label: 'Modelo', placeholder: 'Modelo', name: 'Modelo', type: 'text' },
            { label: 'Tipo', placeholder: 'Tipo', name: 'Tipo', type: 'text' },
            { label: 'Ver Mecanica', placeholder: 'Ver Mecanica', name: 'VerMecanica', type: 'date' },
            { label: 'Ver Contaminantes', placeholder: 'Ver Contaminantes', name: 'VerContaminantes', type: 'date' },
            { label: 'Ver US', placeholder: 'Ver US', name: 'VerUS', type: 'date' },
            { label: 'Poliza US', placeholder: 'Poliza US', name: 'PolizaUS', type: 'date' },
            { label: 'Poliza MX', placeholder: 'Poliza MX', name: 'PolizaMX', type: 'date' },
          ].map(({ label, placeholder, name, type }) => (
            <div key={name} className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {requiredFields.includes(name) && <span className="text-red-500">*</span>} {label}:
              </label>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={
                  type === 'date'
                    ? formData[name as keyof Unidad] instanceof Date
                      ? (formData[name as keyof Unidad] as Date).toString().split('T')[0]
                      : ''
                    : String(formData[name as keyof Unidad] ?? '')
                }
                onChange={type === 'date' ? handleDateChange : handleChange}
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
          {unidad && (
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
            {unidad ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
