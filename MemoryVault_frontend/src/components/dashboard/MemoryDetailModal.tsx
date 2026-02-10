import React, { useState } from 'react';
import { formatDate, formatFileSize, getCategoryLabel, getIPFSUrl } from '@/services/api';
import type { Memory } from '@/types';
import { ShareModal } from './ShareModal';
import { 
  X, 
  Download, 
  Share2, 
  Trash2, 
  CheckCircle, 
  ExternalLink,
  Loader2,
  ShieldCheck,
  Calendar,
  HardDrive,
  Hash,
  FileText,
  Link
} from 'lucide-react';

interface MemoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  memory: Memory | null;
  onDelete: (id: string) => Promise<{ success: boolean; message?: string }>;
  onVerify: (id: string) => Promise<{ success: boolean; data?: any; message?: string }>;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  isOpen,
  onClose,
  memory,
  onDelete,
  onVerify
}) => {
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ success: boolean; message?: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  if (!isOpen || !memory) return null;

  const isImage = memory.fileType?.startsWith('image/');

  const handleVerify = async () => {
    setVerifying(true);
    const result = await onVerify(memory._id);
    setVerifyResult({
      success: result.success,
      message: result.success ? 'Memory verified on blockchain!' : result.message
    });
    setVerifying(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this memory? This action cannot be undone.')) {
      setDeleting(true);
      const result = await onDelete(memory._id);
      if (result.success) {
        onClose();
      }
      setDeleting(false);
    }
  };

  const handleDownload = () => {
    window.open(getIPFSUrl(memory.ipfsHash), '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-black/5">
            <h2 className="text-xl font-bold text-black truncate">{memory.title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Image/Preview */}
            {isImage ? (
              <img
                src={getIPFSUrl(memory.ipfsHash)}
                alt={memory.title}
                className="w-full max-h-80 object-contain bg-gray-100 rounded-lg mb-6"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto" />
                  <p className="text-gray-500 mt-2">{getCategoryLabel(memory.category)}</p>
                </div>
              </div>
            )}

            {/* Description */}
            {memory.description && (
              <p className="text-black/60 mb-6">{memory.description}</p>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-black/40 uppercase mb-1">Category</p>
                <p className="font-medium">{getCategoryLabel(memory.category)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-black/40 uppercase mb-1">Created</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(memory.createdAt)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-black/40 uppercase mb-1">File Size</p>
                <p className="font-medium flex items-center gap-1">
                  <HardDrive className="w-4 h-4" />
                  {formatFileSize(memory.fileSize || 0)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-black/40 uppercase mb-1">Status</p>
                <p className="font-medium flex items-center gap-1">
                  {memory.isOnChain ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      On-Chain
                    </span>
                  ) : (
                    <span className="text-orange-600">Off-Chain</span>
                  )}
                </p>
              </div>
            </div>

            {/* IPFS Hash */}
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="text-xs text-black/40 uppercase mb-1">IPFS Hash</p>
              <p className="font-mono text-sm break-all flex items-center gap-2">
                <Hash className="w-4 h-4 flex-shrink-0" />
                {memory.ipfsHash}
              </p>
            </div>

            {/* Transaction Hash */}
            {memory.txHash && (
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <p className="text-xs text-black/40 uppercase mb-1">Transaction Hash</p>
                <p className="font-mono text-sm break-all">{memory.txHash}</p>
              </div>
            )}

            {/* Verification Result */}
            {verifyResult && (
              <div className={`p-4 rounded-lg mb-4 ${
                verifyResult.success ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                <p className="flex items-center gap-2">
                  {verifyResult.success ? <ShieldCheck className="w-5 h-5" /> : null}
                  {verifyResult.message}
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 p-6 border-t border-black/5">
            {/* Share Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Link className="w-4 h-4" />
              Share
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-black/5 text-black rounded-lg hover:bg-black/10 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>

            {memory.isOnChain && (
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Verify
              </button>
            )}

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        memory={memory}
      />
    </>
  );
};