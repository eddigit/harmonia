import axios from 'axios';
import { AudioFile, ProcessingSettings, FrequencyData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for file uploads
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || error.response.data?.message || 'Server error';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error - please check your connection');
    } else {
      // Something else happened
      throw new Error(error.message || 'Unknown error occurred');
    }
  }
);

export const uploadAudioFile = async (formData: FormData): Promise<{ success: boolean; file: AudioFile }> => {
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const processAudio = async (
  fileId: string, 
  settings: ProcessingSettings
): Promise<{ success: boolean; processedFile: string; downloadUrl: string }> => {
  const response = await api.post('/process', {
    fileId,
    settings,
  });
  return response.data;
};

export const downloadProcessedFile = async (filename: string): Promise<Blob> => {
  const response = await api.get(`/download/${encodeURIComponent(filename)}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const getFrequencies = async (): Promise<FrequencyData> => {
  const response = await api.get('/frequencies');
  return response.data;
};

export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  const response = await api.get('/health');
  return response.data;
};

export default api;