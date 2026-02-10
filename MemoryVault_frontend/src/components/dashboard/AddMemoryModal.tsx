import React, { useState, useRef } from 'react';
import { fileToBase64 } from '@/services/api';
import type { CreateMemoryData } from '@/types';
import { X, Upload, Image, FileText, Film, Music, File, Loader2 } from 'lucide-react';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMemoryData) => Promise<{ success: boolean; message?: string }>;
}

const CATEGORIES = [
  { value: 'photo', label: 'Photo', icon: Image },
  { value: 'document', label: 'Document', icon: FileText },
  { value: 'video', label: 'Video', icon: Film },
  { value: 'audio', label: 'Audio', icon: Music },
  { value: 'other', label: 'Other', icon: File },
];

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('photo');
  const [storeOnChain, setStoreOnChain] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
      setCategory('photo');
    } else if (selectedFile.type.startsWith('video/')) {
      setPreview(null);
      setCategory('video');
    } else if (selectedFile.type.startsWith('audio/')) {
      setPreview(null);
      setCategory('audio');
    } else if (selectedFile.type.includes('pdf') || selectedFile.type.includes('document')) {
      setPreview(null);
      setCategory('document');
    } else {
      setPreview(null);
      setCategory('other');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileChange(droppedFile);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const base64 = await fileToBase64(file);
      
      const result = await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        fileData: base64,
        fileName: file.name,
        fileType: file.type,
        storeOnChain
      });

      if (result.success) {
        resetForm();
        onClose();
      } else {
        setError(result.message || 'Failed to create memory');
      }
    } catch (err) {
      setError('Failed to process file');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('photo');
    setStoreOnChain(false);
    setFile(null);
    setPreview(null);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <h2 className="text-xl font-bold text-black">Add New Memory</h2>
          <button onClick={handleClose} className="p-2 hover:bg-black/5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* File Upload */}
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-black bg-black/5' : 'border-black/20 hover:border-black/40'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                className="hidden"
              />
              <Upload className="w-12 h-12 text-black/30 mx-auto mb-4" />
              <p className="font-medium text-black">Drop your file here or click to browse</p>
              <p className="text-sm text-black/50 mt-1">Supports images, videos, audio, and documents</p>
            </div>
          ) : (
            <div className="space-y-3">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <File className="w-10 h-10 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-500 mt-2">{file.name}</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => { setFile(null); setPreview(null); }}
                className="text-sm text-red-600 hover:underline"
              >
                Remove file
              </button>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your memory a title"
              className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              rows={3}
              className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
              maxLength={500}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === cat.value
                      ? 'bg-black text-white'
                      : 'bg-black/5 text-black hover:bg-black/10'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Blockchain Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-black">Store on Blockchain</p>
              <p className="text-sm text-black/50">Create immutable proof on Aptos</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={storeOnChain}
                onChange={(e) => setStoreOnChain(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-black/5">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-black hover:bg-black/5 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium bg-black text-white rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Saving...' : 'Save Memory'}
          </button>
        </div>
      </div>
    </div>
  );
};