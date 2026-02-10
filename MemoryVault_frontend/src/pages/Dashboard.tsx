import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMemories } from '@/hooks/useMemories';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { Timeline } from '@/components/dashboard/Timeline';
import { AddMemoryModal } from '@/components/dashboard/AddMemoryModal';
import { MemoryDetailModal } from '@/components/dashboard/MemoryDetailModal';
import type { Memory } from '@/types';
import { Plus, Search, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'photo', label: 'Photos' },
  { value: 'document', label: 'Documents' },
  { value: 'video', label: 'Videos' },
  { value: 'audio', label: 'Audio' },
  { value: 'other', label: 'Other' },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    memories,
    loading,
    stats,
    fetchMemories,
    createMemory,
    deleteMemory,
    verifyMemory,
    refresh
  } = useMemories();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    fetchMemories({ category: category === 'all' ? undefined : category });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMemories({ search: searchQuery });
  };

  return (
    <DashboardLayout>
      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Your Timeline</h1>
          <p className="text-black/50">Welcome back, {user?.name || user?.email}</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 sm:flex-none">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search memories..."
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-sm"
              />
            </div>
          </form>

          {/* Refresh */}
          <button
            onClick={refresh}
            className="p-2.5 border border-black/10 rounded-lg hover:bg-black/5 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Add Memory */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-black/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Memory</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.value
                ? 'bg-black text-white'
                : 'bg-black/5 text-black/60 hover:bg-black/10 hover:text-black'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <Timeline
        memories={memories}
        loading={loading}
        onMemoryClick={setSelectedMemory}
        onAddClick={() => setShowAddModal(true)}
      />

      {/* Add Memory Modal */}
      <AddMemoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={createMemory}
      />

      {/* Memory Detail Modal */}
      <MemoryDetailModal
        isOpen={!!selectedMemory}
        onClose={() => setSelectedMemory(null)}
        memory={selectedMemory}
        onDelete={deleteMemory}
        onVerify={verifyMemory}
      />
    </DashboardLayout>
  );
};

export default Dashboard;