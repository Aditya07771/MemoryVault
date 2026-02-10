import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Share2, Shield, FileText, Eye, Clock } from 'lucide-react';

const Privacy: React.FC = () => {
  // Mock shared items - in real app, fetch from API
  const sharedItems = [
    { id: 1, title: 'Family Photo 2023', sharedWith: 'john@example.com', expiresIn: '5 days' },
    { id: 2, title: 'Travel Video', sharedWith: 'sarah@example.com', expiresIn: '12 days' }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-black mb-2">Privacy & Control</h1>
        <p className="text-black/50 mb-8">Manage who has access to your memories</p>

        {/* Active Shares */}
        <div className="bg-white rounded-xl border border-black/5 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Share2 className="w-5 h-5 text-black/50" />
            <h2 className="text-lg font-semibold">Active Shares</h2>
          </div>

          {sharedItems.length > 0 ? (
            <div className="space-y-3">
              {sharedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                      {item.sharedWith.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-black/50">
                        Shared with {item.sharedWith} • Expires in {item.expiresIn}
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-black/50 py-8">You haven't shared any memories yet</p>
          )}
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-xl border border-black/5 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-black/50" />
            <h2 className="text-lg font-semibold">Privacy Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-black/5">
              <div>
                <p className="font-medium">Default Visibility</p>
                <p className="text-sm text-black/50">New memories will be private by default</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">Private</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-black/5">
              <div>
                <p className="font-medium">Share Notifications</p>
                <p className="text-sm text-black/50">Get notified when someone views your shared memories</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Auto-expire Shares</p>
                <p className="text-sm text-black/50">Automatically expire all shares after 30 days</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Access Log */}
        <div className="bg-white rounded-xl border border-black/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-5 h-5 text-black/50" />
            <h2 className="text-lg font-semibold">Access Log</h2>
          </div>
          <p className="text-center text-black/50 py-8">No recent access activity</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Privacy;