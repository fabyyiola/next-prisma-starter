import { get, post, put, del } from './postApi';

const API_URL = '/api/direcciones';

export const fetchDirecciones = async () => {
  return await get(API_URL);
};

export const createDireccion = async (direccionData: any) => {
  return await post(API_URL, direccionData);
};

export const updateDireccion = async (id: number, direccionData: any) => {
  return await put(`${API_URL}/${id}`, direccionData);
};

export const deleteDireccion = async (id: number) => {
  return await del(`${API_URL}/${id}`);
};
