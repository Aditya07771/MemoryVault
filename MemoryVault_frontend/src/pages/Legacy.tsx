import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getInitials } from '@/services/api';
import { Heart, Users, Info, Plus, X, RefreshCw } from 'lucide-react';

interface TrustedContact {
  id: number;
  name: string;
  email: string;
  relationship: string;
}

const Legacy: React.FC = () => {
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', relationship: 'Spouse' }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', email: '', relationship: '' });

  const handleAddContact = () => {
    if (newContact.name && newContact.email) {
      setTrustedContacts([
        ...trustedContacts,
        { ...newContact, id: Date.now() }
      ]);
      setNewContact({ name: '', email: '', relationship: '' });
      setShowAddForm(false);
    }
  };

  const handleRemoveContact = (id: number) => {
    setTrustedContacts(trustedContacts.filter(c => c.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-black mb-2">Legacy & Recovery</h1>
        <p className="text-black/50 mb-8">Plan for the future and set up account recovery</p>

        {/* How It Works */}
        <div className="bg-white rounded-xl border border-black/5 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-5 h-5 text-black/50" />
            <h2 className="text-lg font-semibold">How Legacy Works</h2>
          </div>

          <div className="space-y-6">
            {[
              { num: 1, title: 'Add Trusted People', desc: 'Choose family members or friends you trust to receive your memories' },
              { num: 2, title: 'Set Conditions', desc: 'Define when and how your memories should be transferred' },
              { num: 3, title: 'Automatic Transfer', desc: 'Your memories will be securely transferred when conditions are met' }
            ].map((step) => (
              <div key={step.num} className="flex gap-4">
                <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm text-black/50">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trusted Contacts */}
        <div className="bg-white rounded-xl border border-black/5 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-black/50" />
            <h2 className="text-lg font-semibold">Trusted Contacts</h2>
          </div>

          {trustedContacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                  {getInitials(contact.name)}
                </div>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-black/50">{contact.email} • {contact.relationship}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveContact(contact.id)}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}

          {showAddForm ? (
            <div className="p-4 bg-gray-50 rounded-lg mt-4">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full px-4 py-2 border border-black/10 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  className="w-full px-4 py-2 border border-black/10 rounded-lg"
                />
                <select
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                  className="w-full px-4 py-2 border border-black/10 rounded-lg"
                >
                  <option value="">Select relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-sm hover:bg-black/5 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddContact}
                    className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-black/80"
                  >
                    Add Contact
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 mt-4 px-4 py-2 border border-black/10 rounded-lg hover:bg-black/5"
            >
              <Plus className="w-4 h-4" />
              Add Trusted Contact
            </button>
          )}
        </div>

        {/* Legacy Settings */}
        <div className="bg-white rounded-xl border border-black/5 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-5 h-5 text-black/50" />
            <h2 className="text-lg font-semibold">Legacy Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-black/5">
              <div>
                <p className="font-medium">Enable Legacy Mode</p>
                <p className="text-sm text-black/50">Allow memories to be transferred to trusted contacts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-black/5">
              <div>
                <p className="font-medium">Inactivity Period</p>
                <p className="text-sm text-black/50">Transfer after this period of inactivity</p>
              </div>
              <select className="px-3 py-2 border border-black/10 rounded-lg text-sm">
                <option>6 months</option>
                <option>1 year</option>
                <option>2 years</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Verification Required</p>
                <p className="text-sm text-black/50">Require identity verification before transfer</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Recovery */}
        <div className="bg-white rounded-xl border border-black/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="w-5 h-5 text-black/50" />
            <h2 className="text-lg font-semibold">Account Recovery</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-black/5">
              <div>
                <p className="font-medium">Recovery Email</p>
                <p className="text-sm text-black/50">Secondary email for account recovery</p>
              </div>
              <button className="px-4 py-2 text-sm border border-black/10 rounded-lg hover:bg-black/5">
                Add Email
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Social Recovery</p>
                <p className="text-sm text-black/50">Allow trusted contacts to help recover your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Legacy;