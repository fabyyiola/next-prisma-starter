import { Cliente } from '@/types/schema.types';
import { get, post, put, del } from './postApi';

const API_URL = '/api/clientes';

export const fetchClients = async () => {
  return await get(API_URL);
};

export const createClient = async (clientData: Cliente) => {
  return await post(API_URL, clientData);
};

export const updateClient = async (id: number, clientData: Cliente) => {
  return await put(`${API_URL}/${id}`, clientData);
};

export const deleteClient = async (id: number) => {
  return await del(`${API_URL}/${id}`);
};
