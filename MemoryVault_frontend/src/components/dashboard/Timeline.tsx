import React from 'react';
import { MemoryCard } from './MemoryCard';
import type { Memory } from '@/types';
import { ImagePlus } from 'lucide-react';

interface TimelineProps {
  memories: Memory[];
  loading: boolean;
  onMemoryClick: (memory: Memory) => void;
  onAddClick: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({ 
  memories, 
  loading, 
  onMemoryClick,
  onAddClick 
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!memories || memories.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-black/5 p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ImagePlus className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-black mb-2">Start Your Journey</h3>
        <p className="text-black/50 mb-6">Add your first memory to begin building your timeline.</p>
        <button
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-black/80 transition-colors"
        >
          <ImagePlus className="w-5 h-5" />
          Add Your First Memory
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {memories.map((memory) => (
        <MemoryCard
          key={memory._id}
          memory={memory}
          onClick={() => onMemoryClick(memory)}
        />
      ))}
    </div>
  );
};