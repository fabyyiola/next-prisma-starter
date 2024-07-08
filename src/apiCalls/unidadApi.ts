import { Unidad } from '@/types/schema.types';
import { get, post, put, del } from './postApi';

const API_URL = '/api/unidades';

export const fetchUnidades = async () => {
  return await get(API_URL);
};

export const createUnidad = async (unidadData: Unidad) => {
  return await post(API_URL, unidadData);
};

export const updateUnidad = async (id: number, unidadData: Unidad) => {
  return await put(`${API_URL}/${id}`, unidadData);
};

export const deleteUnidad = async (id: number) => {
  return await del(`${API_URL}/${id}`);
};
