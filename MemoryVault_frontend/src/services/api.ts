import axios from 'axios';
import type { Memory, MemoryStats, User, ApiResponse, CreateMemoryData, Pagination } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', { email, password }),
  
  register: (email: string, password: string, name?: string) => 
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', { email, password, name }),
  
  getMe: () => 
    api.get<ApiResponse<User>>('/auth/me'),
  
  demo: () => 
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/demo')
};

// Memory API
export const memoryAPI = {
  getAll: (params: { page?: number; limit?: number; category?: string; search?: string } = {}) => 
    api.get<ApiResponse<{ memories: Memory[]; pagination: Pagination }>>('/memories', { params }),
  
  getOne: (id: string) => 
    api.get<ApiResponse<Memory>>(`/memories/${id}`),
  
  create: (data: CreateMemoryData) => 
    api.post<ApiResponse<{ memory: Memory; ipfs: { hash: string; url: string }; aptos?: any }>>('/memories', data),
  
  delete: (id: string) => 
    api.delete<ApiResponse<null>>(`/memories/${id}`),
  
  verify: (id: string) => 
    api.get<ApiResponse<{ verified: boolean; data?: any; message?: string }>>(`/memories/${id}/verify`),
  
  getStats: () => 
    api.get<ApiResponse<MemoryStats>>('/memories/stats')
};

// Utility functions
export const getIPFSUrl = (hash: string) => `${IPFS_GATEWAY}/${hash}`;

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const formatFileSize = (bytes: number): string => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    document: 'Document',
    photo: 'Photo',
    video: 'Video',
    audio: 'Audio',
    other: 'Other'
  };
  return labels[category] || 'Other';
};

export const getInitials = (name?: string): string => {
  if (!name) return 'U';
  const parts = name.split(/[@.\s]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Share API
export const shareAPI = {
  // Create share link
  create: (data: {
    memoryId: string;
    duration: string;
    accessType?: 'view' | 'download';
    maxViews?: number | null;
    password?: string;
  }) => api.post('/share', data),

  // Get shared memory (public)
  getShared: (shortCode: string, password?: string) => 
    api.get(`/share/${shortCode}${password ? `?password=${encodeURIComponent(password)}` : ''}`),

  // Verify share link (public)
  verify: (shortCode: string) => api.get(`/share/${shortCode}/verify`),

  // Get user's share links
  getMyLinks: () => api.get('/share/user/my-links'),

  // Get share links for a memory
  getMemoryLinks: (memoryId: string) => api.get(`/share/memory/${memoryId}`),

  // Revoke share link
  revoke: (shortCode: string) => api.delete(`/share/${shortCode}`),

  // Update share link
  update: (shortCode: string, data: {
    duration?: string;
    maxViews?: number | null;
    password?: string;
    removePassword?: boolean;
  }) => api.patch(`/share/${shortCode}`, data),
};

export default api;