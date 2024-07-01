import { get, post, put, del } from './postApi';

const API_URL = '/api/clientes';

export const fetchClients = async () => {
  return await get(API_URL);
};

export const createClient = async (clientData: any) => {
  return await post(API_URL, clientData);
};

export const updateClient = async (id: number, clientData: any) => {
  return await put(`${API_URL}/${id}`, clientData);
};

export const deleteClient = async (id: number) => {
  return await del(`${API_URL}/${id}`);
};
