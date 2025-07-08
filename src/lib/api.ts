import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth_token');
      Cookies.remove('user_data');
      
      if (typeof window !== 'undefined') {
        const unauthorizedEvent = new CustomEvent('unauthorized-error', {
          detail: { name: 'UnauthorizedError' }
        });
        window.dispatchEvent(unauthorizedEvent);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
