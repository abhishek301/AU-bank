import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Axios automatically handles Accept-Encoding for compression
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add timestamp to prevent caching if needed
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now() // Optional: prevent caching
      };
    }
    
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    
    // Log compression info if available
    if (response.headers['content-encoding']) {
      console.log(`📦 Compression: ${response.headers['content-encoding']}`);
    }
    
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ Response Error:', error);
    
    const status = error.response?.status;

    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout');
    }

    if (status === 404) {
      console.error('🔍 Resource not found');
    }

    if (status !== undefined && status >= 500) {
      console.error('🚨 Server error');
    }
    
    return Promise.reject(error);
  }
);

// Retry function for failed requests
const retryRequest = async (
  requestFn: () => Promise<any>,
  attempts: number = API_CONFIG.RETRY_ATTEMPTS
): Promise<any> => {
  try {
    return await requestFn();
  } catch (error) {
    if (attempts > 1 && axios.isAxiosError(error)) {
      console.log(`🔄 Retrying request... (${API_CONFIG.RETRY_ATTEMPTS - attempts + 1}/${API_CONFIG.RETRY_ATTEMPTS})`);
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      return retryRequest(requestFn, attempts - 1);
    }
    throw error;
  }
};

export { apiClient, retryRequest };