import { RegimenFiscal } from '@/types/schema.types';
import { get, post, put, del } from './postApi';

const API_URL = '/api/regimenFiscal';

export const fetchRegimenFiscales = async () => {
  return await get(API_URL);
};

export const createRegimenFiscal = async (regimenFiscalData: RegimenFiscal) => {
  return await post(API_URL, regimenFiscalData);
};

export const updateRegimenFiscal = async (id: number, regimenFiscalData: RegimenFiscal) => {
  return await put(`${API_URL}/${id}`, regimenFiscalData);
};

export const deleteRegimenFiscal = async (id: number) => {
  return await del(`${API_URL}/${id}`);
};
