import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Define a generic API request function
const apiRequest = async <T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    // Handle error here, for example, by logging it or throwing a custom error
    console.error('API request error:', error);
    throw error;
  }
};

// Wrapper functions for different HTTP methods
const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiRequest<T>({ ...config, url, method: 'GET' });
  return response.data;
};

const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiRequest<T>({ ...config, url, method: 'POST', data });
  return response.data;
};

const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiRequest<T>({ ...config, url, method: 'PUT', data });
  return response.data;
};

const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiRequest<T>({ ...config, url, method: 'DELETE' });
  return response.data;
};

export { get, post, put, del };
