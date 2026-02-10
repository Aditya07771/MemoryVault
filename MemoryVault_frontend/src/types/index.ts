export interface User {
  id: string;
  email: string;
  name?: string;
  aptosAddress?: string;
  aptosBalance?: number;
  totalMemories: number;
  storageUsed: number;
  createdAt: string;
}

export interface Memory {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'document' | 'photo' | 'video' | 'audio' | 'other';
  ipfsHash: string;
  ipfsUrl?: string;
  txHash?: string;
  txVersion?: string;
  isOnChain: boolean;
  fileType?: string;
  fileSize?: number;
  fileName?: string;
  isEncrypted: boolean;
  sharedWith: SharedUser[];
  createdAt: string;
  updatedAt: string;
}

export interface SharedUser {
  userId: string;
  permissions: 'view' | 'download';
  sharedAt: string;
}

export interface MemoryStats {
  overview: {
    totalMemories: number;
    totalSize: number;
    onChain: number;
  };
  byCategory: Array<{
    _id: string;
    count: number;
  }>;
  aptos?: {
    balance: number;
    formattedBalance: string;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface CreateMemoryData {
  title: string;
  description?: string;
  category: string;
  fileData: string;
  fileName: string;
  fileType: string;
  storeOnChain: boolean;
}