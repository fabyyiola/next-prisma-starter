import { useState, useEffect, ChangeEvent } from 'react';
import { createEmpleado, updateEmpleado, deleteEmpleado } from '@/apiCalls';
import { Empleado } from '@/types/schema.types';
import InputText from '@/components/InputText';
import InputNumber from '@/components/InputNumber';
import InputDate from '@/components/InputDate';

interface EmpleadoFormProps {
  onSuccess?: (data: Empleado | unknown) => void;
  onError?: (error: string) => void;
  empleado?: Empleado | null;
}

export default function EmpleadoForm({
  onSuccess,
  onError,
  empleado = null,
}: EmpleadoFormProps) {
  const [formData, setFormData] = useState<Empleado>({
    ID: NaN,
    Nombre: '',
    Direccion: '',
    Telefono: '',
    Email: '',
    NombreConyuge: '',
    TelefonoConyuge: '',
    CURP: '',
    RFC: '',
    AptoMedico: '',
    Licencia: '',
    Tipo: '',
    SueldoSemanal: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const requiredFields = [
    'Nombre',
    'Direccion',
    'Telefono',
    'CURP',
    'RFC',
    'Tipo',
    'SueldoSemanal',
  ];

  useEffect(() => {
    if (empleado) {
      console.log('Setting empleado data:', empleado);
      setFormData({
        ...empleado,
        AptoMedico: empleado.AptoMedico,
        Licencia: empleado.Licencia,
      });
    }
  }, [empleado]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error message when user starts typing
  };

  const handleDelete = async () => {
    try {
      if (empleado && empleado.ID) {
        console.log('Deleting empleado with ID:', empleado.ID);
        await deleteEmpleado(empleado.ID);
        if (onSuccess) {
          onSuccess(empleado.ID);
        }
      } else {
        throw 'Unhandled error: Empleado ID is missing';
      }
    } catch (error) {
      console.error('Error deleting empleado:', error);
      if (onError) {
        onError(`Error deleting empleado: ${error}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from propagating to the parent form

    console.log('Form submitted with data:', formData);

    const newErrors: { [key: string]: string } = {};

    requiredFields.forEach((field) => {
      if (!formData[field as keyof Empleado]) {
        newErrors[field] = `${field} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      console.log('Validation errors:', newErrors);
      setErrors(newErrors);
      return;
    }

    try {
      let response: Empleado | unknown = undefined;
      if (empleado) {
        console.log('Updating empleado with data:', formData);
        response = await updateEmpleado(formData.ID, formData);
      } else {
        console.log('Creating new empleado with data:', formData);
        response = await createEmpleado(formData);
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
            { label: 'Direccion', placeholder: 'Direccion', name: 'Direccion', type: 'text' },
            { label: 'Telefono', placeholder: 'Telefono', name: 'Telefono', type: 'text' },
            { label: 'Email', placeholder: 'Email', name: 'Email', type: 'text' },
            { label: 'Nombre del Conyuge', placeholder: 'Nombre del Conyuge', name: 'NombreConyuge', type: 'text' },
            { label: 'Telefono del Conyuge', placeholder: 'Telefono del Conyuge', name: 'TelefonoConyuge', type: 'text' },
            { label: 'CURP', placeholder: 'CURP', name: 'CURP', type: 'text' },
            { label: 'RFC', placeholder: 'RFC', name: 'RFC', type: 'text' },
            { label: 'Tipo', placeholder: 'Tipo', name: 'Tipo', type: 'text' },
            { label: 'Sueldo Semanal', placeholder: 'Sueldo Semanal', name: 'SueldoSemanal', type: 'number' },
            { label: 'Apto Medico', placeholder: 'Apto Medico', name: 'AptoMedico', type: 'date' },
            { label: 'Licencia', placeholder: 'Licencia', name: 'Licencia', type: 'date' },
          ].map(({ label, placeholder, name, type }) => (
            <div key={name} className="w-full md:w-1/2 px-2 mb-4">
              {type === 'text' && (
                <InputText
                  label={label}
                  name={name}
                  placeholder={placeholder}
                  value={String(formData[name as keyof Empleado] ?? '')}
                  required={requiredFields.includes(name)}
                  error={errors[name]}
                  onChange={handleChange}
                />
              )}
              {type === 'number' && (
                <InputNumber
                  label={label}
                  name={name}
                  placeholder={placeholder}
                  value={Number(formData[name as keyof Empleado] ?? 0)}
                  required={requiredFields.includes(name)}
                  error={errors[name]}
                  onChange={handleChange}
                />
              )}
              {type === 'date' && (
                <InputDate
                  label={label}
                  name={name}
                  placeholder={placeholder}
                  value={formData[name as keyof Empleado]?.toString() ?? ''}
                  required={requiredFields.includes(name)}
                  error={errors[name]}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4">
          {empleado && (
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
            {empleado ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
