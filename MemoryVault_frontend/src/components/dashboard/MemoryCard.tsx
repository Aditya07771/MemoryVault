import React from 'react';
import { formatDate, getCategoryLabel, getIPFSUrl } from '@/services/api';
import type { Memory } from '@/types';
import { Calendar, CheckCircle, FileText, Image, Film, Music, File } from 'lucide-react';

interface MemoryCardProps {
  memory: Memory;
  onClick: () => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'photo': return Image;
    case 'video': return Film;
    case 'audio': return Music;
    case 'document': return FileText;
    default: return File;
  }
};

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onClick }) => {
  const isImage = memory.fileType?.startsWith('image/');
  const CategoryIcon = getCategoryIcon(memory.category);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-black/5 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
    >
      {/* Image/Preview */}
      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img
            src={getIPFSUrl(memory.ipfsHash)}
            alt={memory.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <CategoryIcon className="w-12 h-12" />
            <span className="text-xs">{getCategoryLabel(memory.category)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-black truncate">{memory.title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            memory.category === 'photo' ? 'bg-blue-100 text-blue-600' :
            memory.category === 'document' ? 'bg-purple-100 text-purple-600' :
            memory.category === 'video' ? 'bg-red-100 text-red-600' :
            memory.category === 'audio' ? 'bg-green-100 text-green-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            {getCategoryLabel(memory.category)}
          </span>
        </div>

        {memory.description && (
          <p className="text-sm text-black/50 mb-3 line-clamp-2">{memory.description}</p>
        )}

        <div className="flex items-center justify-between text-xs text-black/40">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(memory.createdAt)}
          </span>
          {memory.isOnChain && (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-3 h-3" />
              On-Chain
            </span>
          )}
        </div>
      </div>
    </div>
  );
};