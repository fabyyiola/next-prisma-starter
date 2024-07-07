import { get, post, put, del } from './postApi';

const API_URL = '/api/empleado';

export const fetchEmpleados = async () => {
  return await get(API_URL);
};

export const createEmpleado = async (empleadoData: any) => {
  return await post(API_URL, empleadoData);
};

export const updateEmpleado = async (id: number, empleadoData: any) => {
  return await put(`${API_URL}/${id}`, empleadoData);
};

export const deleteEmpleado = async (id: number) => {
  return await del(`${API_URL}/${id}`);
};
