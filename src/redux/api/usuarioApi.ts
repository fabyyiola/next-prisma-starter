import { get, post, put, del } from './postApi';

const API_URL = '/api/usuarios';

export const fetchUsuarios = async () => {
  return await get(API_URL);
};

export const createUsuario = async (usuarioData: any) => {
  return await post(API_URL, usuarioData);
};

export const updateUsuario = async (id: number, usuarioData: any) => {
  return await put(`${API_URL}/${id}`, usuarioData);
};

export const deleteUsuario = async (id: number) => {
  return await del(`${API_URL}/${id}`);
};
