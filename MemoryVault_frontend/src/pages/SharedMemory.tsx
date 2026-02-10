import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { shareAPI, getIPFSUrl } from '@/services/api';
import {
  Vault,
  Lock,
  Clock,
  Eye,
  Download,
  AlertCircle,
  Loader2,
  Image,
  FileText,
  Film,
  Music,
  File,
  Calendar,
  User,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';

interface SharedMemoryData {
  memory: {
    title: string;
    description?: string;
    category: string;
    fileType?: string;
    fileName?: string;
    createdAt: string;
    ipfsUrl: string;
    ipfsHash?: string;
  };
  share: {
    accessType: 'view' | 'download';
    expiresAt: string;
    remainingTime: string;
    viewCount: number;
    maxViews: number | null;
  };
  sharedBy: {
    name: string;
  };
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

const SharedMemory: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [data, setData] = useState<SharedMemoryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Verify link first
  useEffect(() => {
    const verifyLink = async () => {
      if (!shortCode) return;

      try {
        const response = await shareAPI.verify(shortCode);
        
        if (!response.data.valid) {
          if (response.data.message?.includes('expired')) {
            setExpired(true);
          }
          setError(response.data.message || 'Link is not valid');
        } else if (response.data.passwordRequired) {
          setPasswordRequired(true);
        } else {
          // Link is valid and no password, fetch content
          await fetchSharedMemory();
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Link not found');
      } finally {
        setVerifying(false);
      }
    };

    verifyLink();
  }, [shortCode]);

  const fetchSharedMemory = async (pwd?: string) => {
    if (!shortCode) return;

    try {
      setLoading(true);
      setPasswordError(false);
      
      const response = await shareAPI.getShared(shortCode, pwd);
      setData(response.data.data);
      setPasswordRequired(false);
    } catch (err: any) {
      if (err.response?.status === 401 && err.response?.data?.passwordRequired) {
        setPasswordRequired(true);
        setPasswordError(!!pwd);
      } else if (err.response?.status === 410) {
        setExpired(true);
        setError(err.response?.data?.message || 'Link has expired');
      } else {
        setError(err.response?.data?.message || 'Failed to load shared memory');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      fetchSharedMemory(password);
    }
  };

  const handleDownload = () => {
    if (data?.memory.ipfsHash) {
      window.open(data.memory.ipfsUrl, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isImage = data?.memory.fileType?.startsWith('image/');
  const CategoryIcon = data ? getCategoryIcon(data.memory.category) : File;

  // Loading/Verifying state
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-black/30 mx-auto mb-4" />
          <p className="text-black/50">Verifying link...</p>
        </div>
      </div>
    );
  }

  // Expired state
  if (expired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Link Expired</h1>
          <p className="text-black/50 mb-6">
            This share link has expired and is no longer accessible.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/80"
          >
            <Vault className="w-5 h-5" />
            Go to LifeVault
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !passwordRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Link Not Found</h1>
          <p className="text-black/50 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/80"
          >
            <Vault className="w-5 h-5" />
            Go to LifeVault
          </Link>
        </div>
      </div>
    );
  }

  // Password required state
  if (passwordRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">Password Required</h1>
            <p className="text-black/50">This shared memory is password protected</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl p-8 shadow-xl">
            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                Incorrect password. Please try again.
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-2">
                Enter Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!password || loading}
              className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-black/80 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Access Memory'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-black/50 hover:text-black">
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              Back to LifeVault
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading content
  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-black/30 mx-auto mb-4" />
          <p className="text-black/50">Loading shared memory...</p>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-black/5">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
              <Vault className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">LifeVault</span>
          </Link>
          
          <div className="flex items-center gap-4 text-sm text-black/50">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {data.share.remainingTime}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {data.share.viewCount} views
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Image/Preview */}
          <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
            {isImage ? (
              <img
                src={data.memory.ipfsUrl}
                alt={data.memory.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center">
                <CategoryIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{data.memory.category}</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-black mb-2">{data.memory.title}</h1>
            
            {data.memory.description && (
              <p className="text-black/60 mb-6">{data.memory.description}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-black/40 uppercase mb-1">Category</p>
                <p className="font-medium text-black capitalize">{data.memory.category}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-black/40 uppercase mb-1">Created</p>
                <p className="font-medium text-black">{formatDate(data.memory.createdAt)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-black/40 uppercase mb-1">Shared By</p>
                <p className="font-medium text-black">{data.sharedBy.name}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-black/40 uppercase mb-1">Expires</p>
                <p className="font-medium text-black">{data.share.remainingTime}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {data.share.accessType === 'download' && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/80"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
              )}
              
              <a
                href={data.memory.ipfsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 border border-black/10 text-black rounded-xl font-medium hover:bg-black/5"
              >
                <ExternalLink className="w-5 h-5" />
                View Full Size
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-black/40 mb-4">
            This memory was shared via LifeVault - Your secure memory vault
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-black font-medium hover:underline"
          >
            Create your own vault
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default SharedMemory;