import { Usuario } from '@/types/schema.types';
import { get, post, put, del } from './postApi';

const API_URL = '/api/usuario';

export const fetchUsers = async () => {
  return await get(API_URL);
};

export const createUser = async (userData: Usuario) => {
  return await post(API_URL, userData);
};

export const updateUser = async (id: number, userData: Usuario) => {
  return await put(`${API_URL}/${id}`, userData);
};

export const deleteUser = async (id: number) => {
  return await del(`${API_URL}/${id}`);
};

export const fetchUserByEmail = async (email: string) => {
  const encodedEmail = encodeURIComponent(email);
  return await get(`${API_URL}?email=${encodedEmail}`);
};