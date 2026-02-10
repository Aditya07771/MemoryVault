import React from 'react';
import { formatFileSize } from '@/services/api';
import type { MemoryStats } from '@/types';
import { Image, Layers, HardDrive, Wallet } from 'lucide-react';

interface StatsCardsProps {
  stats: MemoryStats | null;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      label: 'Total Memories',
      value: stats?.overview?.totalMemories || 0,
      icon: Image,
      color: 'bg-blue-500'
    },
    {
      label: 'On Blockchain',
      value: stats?.overview?.onChain || 5,
      icon: Layers,
      color: 'bg-green-500'
    },
    {
      label: 'Storage Used',
      value: formatFileSize(stats?.overview?.totalSize || 0),
      icon: HardDrive,
      color: 'bg-purple-500'
    },
    {
      label: 'Aptos Balance',
      value: stats?.aptos?.formattedBalance || '0 APT',
      icon: Wallet,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-black/5 p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-black">{card.value}</p>
          <p className="text-sm text-black/50">{card.label}</p>
        </div>
      ))}
    </div>
  );
};  