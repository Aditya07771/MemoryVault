import React, { useState, useEffect } from 'react';
import { shareAPI } from '@/services/api';
import type { Memory } from '@/types';
import {
  X,
  Link,
  Copy,
  Check,
  Clock,
  Eye,
  Download,
  Lock,
  Loader2,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Trash2
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  memory: Memory | null;
}

interface ShareLink {
  id: string;
  shortCode: string;
  shareUrl: string;
  accessType: 'view' | 'download';
  expiresAt: string;
  remainingTime: string;
  isExpired: boolean;
  viewCount: number;
  maxViews: number | null;
  isPasswordProtected: boolean;
  createdAt: string;
}

const DURATION_OPTIONS = [
  { value: '1h', label: '1 Hour' },
  { value: '6h', label: '6 Hours' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
];

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  memory
}) => {
  const [tab, setTab] = useState<'create' | 'existing'>('create');
  const [duration, setDuration] = useState('24h');
  const [accessType, setAccessType] = useState<'view' | 'download'>('view');
  const [maxViews, setMaxViews] = useState<string>('');
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [existingLinks, setExistingLinks] = useState<ShareLink[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(false);

  // Fetch existing links when modal opens
  useEffect(() => {
    if (isOpen && memory) {
      fetchExistingLinks();
    }
  }, [isOpen, memory]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCreatedLink(null);
      setError(null);
      setDuration('24h');
      setAccessType('view');
      setMaxViews('');
      setPassword('');
      setUsePassword(false);
    }
  }, [isOpen]);

  const fetchExistingLinks = async () => {
    if (!memory) return;
    
    try {
      setLoadingLinks(true);
      const response = await shareAPI.getMemoryLinks(memory._id);
      setExistingLinks(response.data.data);
    } catch (err) {
      console.error('Failed to fetch existing links:', err);
    } finally {
      setLoadingLinks(false);
    }
  };

  const handleCreateLink = async () => {
    if (!memory) return;

    try {
      setLoading(true);
      setError(null);

      const response = await shareAPI.create({
        memoryId: memory._id,
        duration,
        accessType,
        maxViews: maxViews ? parseInt(maxViews) : null,
        password: usePassword ? password : undefined
      });

      setCreatedLink(response.data.data.shareUrl);
      await fetchExistingLinks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create share link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevokeLink = async (shortCode: string) => {
    if (!window.confirm('Are you sure you want to revoke this link? It will no longer work.')) {
      return;
    }

    try {
      await shareAPI.revoke(shortCode);
      await fetchExistingLinks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to revoke link');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!isOpen || !memory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <div>
            <h2 className="text-xl font-bold text-black">Share Memory</h2>
            <p className="text-sm text-black/50 mt-1 truncate">{memory.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-black/5">
          <button
            onClick={() => setTab('create')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === 'create' 
                ? 'text-black border-b-2 border-black' 
                : 'text-black/50 hover:text-black'
            }`}
          >
            Create New Link
          </button>
          <button
            onClick={() => setTab('existing')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === 'existing' 
                ? 'text-black border-b-2 border-black' 
                : 'text-black/50 hover:text-black'
            }`}
          >
            Existing Links ({existingLinks.length})
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {tab === 'create' && (
            <>
              {/* Created Link Success */}
              {createdLink ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-600 mb-2">Link Created!</h3>
                  <p className="text-sm text-black/50 mb-4">Share this link with anyone</p>
                  
                  <div className="flex items-center gap-2 p-3 bg-black/5 rounded-xl mb-4">
                    <input
                      type="text"
                      value={createdLink}
                      readOnly
                      className="flex-1 bg-transparent text-sm font-mono outline-none"
                    />
                    <button
                      onClick={() => handleCopyLink(createdLink)}
                      className="p-2 hover:bg-black/10 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-black/50" />
                      )}
                    </button>
                    <a
                      href={createdLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-black/10 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 text-black/50" />
                    </a>
                  </div>

                  <button
                    onClick={() => setCreatedLink(null)}
                    className="text-sm text-black/50 hover:text-black"
                  >
                    Create another link
                  </button>
                </div>
              ) : (
                <>
                  {/* Duration */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-black mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Link Expires In
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {DURATION_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setDuration(option.value)}
                          className={`py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                            duration === option.value
                              ? 'bg-black text-white'
                              : 'bg-black/5 text-black hover:bg-black/10'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Access Type */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-black mb-2">
                      Access Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setAccessType('view')}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                          accessType === 'view'
                            ? 'bg-black text-white'
                            : 'bg-black/5 text-black hover:bg-black/10'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        View Only
                      </button>
                      <button
                        onClick={() => setAccessType('download')}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                          accessType === 'download'
                            ? 'bg-black text-white'
                            : 'bg-black/5 text-black hover:bg-black/10'
                        }`}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>

                  {/* Max Views */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-black mb-2">
                      Maximum Views (Optional)
                    </label>
                    <input
                      type="number"
                      value={maxViews}
                      onChange={(e) => setMaxViews(e.target.value)}
                      placeholder="Unlimited"
                      min="1"
                      className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                    />
                    <p className="text-xs text-black/40 mt-1">
                      Leave empty for unlimited views
                    </p>
                  </div>

                  {/* Password Protection */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-black flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Password Protection
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={usePassword}
                          onChange={(e) => setUsePassword(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    {usePassword && (
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                      />
                    )}
                  </div>

                  {/* Create Button */}
                  <button
                    onClick={handleCreateLink}
                    disabled={loading}
                    className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-black/80 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Link className="w-5 h-5" />
                        Create Share Link
                      </>
                    )}
                  </button>
                </>
              )}
            </>
          )}

          {tab === 'existing' && (
            <>
              {loadingLinks ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-black/30 mx-auto" />
                </div>
              ) : existingLinks.length === 0 ? (
                <div className="text-center py-8">
                  <Link className="w-12 h-12 text-black/20 mx-auto mb-4" />
                  <p className="text-black/50">No share links yet</p>
                  <button
                    onClick={() => setTab('create')}
                    className="mt-4 text-sm text-black font-medium hover:underline"
                  >
                    Create your first link
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {existingLinks.map((link) => (
                    <div
                      key={link.id}
                      className={`p-4 rounded-xl border ${
                        link.isExpired 
                          ? 'bg-red-50 border-red-200' 
                          : 'bg-black/5 border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {link.isExpired ? (
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
                              Expired
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                              Active
                            </span>
                          )}
                          {link.isPasswordProtected && (
                            <Lock className="w-3 h-3 text-black/40" />
                          )}
                          <span className="text-xs text-black/40">
                            {link.accessType === 'download' ? 'Download' : 'View only'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {!link.isExpired && (
                            <button
                              onClick={() => handleCopyLink(link.shareUrl)}
                              className="p-1.5 hover:bg-black/10 rounded-lg"
                              title="Copy link"
                            >
                              <Copy className="w-4 h-4 text-black/50" />
                            </button>
                          )}
                          <button
                            onClick={() => handleRevokeLink(link.shortCode)}
                            className="p-1.5 hover:bg-red-100 rounded-lg"
                            title="Revoke link"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>

                      <code className="text-xs text-black/60 break-all">
                        {link.shareUrl}
                      </code>

                      <div className="flex items-center gap-4 mt-2 text-xs text-black/40">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {link.viewCount} views
                          {link.maxViews && ` / ${link.maxViews}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {link.isExpired ? 'Expired' : link.remainingTime}
                        </span>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={fetchExistingLinks}
                    className="w-full py-2 text-sm text-black/50 hover:text-black flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};