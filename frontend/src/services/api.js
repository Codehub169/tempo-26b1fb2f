import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Interceptor for adding auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    // In a real app, you would get the token from localStorage or a state manager
    const token = localStorage.getItem('authToken'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Interceptor for handling responses (e.g., global error handling)
apiClient.interceptors.response.use(
  (response) => response, // Directly return successful responses
  (error) => {
    // Handle errors globally
    // For example, redirect to login on 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // window.location.href = '/login'; // Or use react-router navigate
      console.error('Unauthorized access - 401. Implement redirection to login.');
    }
    // You might want to log errors or show a notification
    console.error('API Error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export const get = (url, params) => apiClient.get(url, { params });
export const post = (url, data) => apiClient.post(url, data);
export const put = (url, data) => apiClient.put(url, data);
export const del = (url) => apiClient.delete(url); // 'delete' is a reserved keyword

export default apiClient;
