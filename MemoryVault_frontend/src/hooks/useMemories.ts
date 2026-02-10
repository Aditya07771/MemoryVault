import { useState, useEffect, useCallback } from 'react';
import { memoryAPI } from '@/services/api';
import type { Memory, MemoryStats, Pagination, CreateMemoryData } from '@/types';

interface UseMemoriesParams {
  category?: string;
  search?: string;
}

export const useMemories = (initialParams: UseMemoriesParams = {}) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [stats, setStats] = useState<MemoryStats | null>(null);

  const fetchMemories = useCallback(async (params: UseMemoriesParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await memoryAPI.getAll({ ...initialParams, ...params });
      setMemories(response.data.data.memories);
      setPagination(response.data.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch memories');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await memoryAPI.getStats();
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const createMemory = async (data: CreateMemoryData) => {
    try {
      const response = await memoryAPI.create(data);
      await fetchMemories();
      await fetchStats();
      return { success: true, data: response.data.data };
    } catch (err: any) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to create memory' 
      };
    }
  };

  const deleteMemory = async (id: string) => {
    try {
      await memoryAPI.delete(id);
      setMemories(prev => prev.filter(m => m._id !== id));
      await fetchStats();
      return { success: true };
    } catch (err: any) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to delete memory' 
      };
    }
  };

  const verifyMemory = async (id: string) => {
    try {
      const response = await memoryAPI.verify(id);
      return { success: true, data: response.data };
    } catch (err: any) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to verify memory' 
      };
    }
  };

  useEffect(() => {
    fetchMemories();
    fetchStats();
  }, [fetchMemories, fetchStats]);

  return {
    memories,
    loading,
    error,
    pagination,
    stats,
    fetchMemories,
    fetchStats,
    createMemory,
    deleteMemory,
    verifyMemory,
    refresh: () => {
      fetchMemories();
      fetchStats();
    }
  };
};

export default useMemories;