import React, { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { Wallet, Loader2, ExternalLink, Check } from 'lucide-react';

interface WalletSelectorProps {
  onConnect?: () => void;
}

export const WalletSelector: React.FC<WalletSelectorProps> = ({ onConnect }) => {
  const { wallets, connecting, connect } = useWallet();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleConnect = async (walletName: string) => {
    setSelectedWallet(walletName);
    try {
      await connect(walletName as any);
      onConnect?.();
    } catch (error) {
      console.error('Connection failed:', error);
    }
    setSelectedWallet(null);
  };

  const availableWallets = wallets.filter(w => w.readyState === 'Installed');
  const notInstalledWallets = wallets.filter(w => w.readyState !== 'Installed');

  return (
    <div className="space-y-4">
      {/* Available Wallets */}
      {availableWallets.length > 0 && (
        <div>
          <p className="text-sm font-medium text-black/70 mb-2">Available Wallets</p>
          <div className="space-y-2">
            {availableWallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => handleConnect(wallet.name)}
                disabled={connecting}
                className="w-full flex items-center gap-3 p-4 border border-black/10 rounded-xl hover:border-black/30 hover:bg-black/5 transition-all disabled:opacity-50"
              >
                <img
                  src={wallet.icon}
                  alt={wallet.name}
                  className="w-8 h-8 rounded-lg"
                />
                <span className="flex-1 text-left font-medium">{wallet.name}</span>
                {connecting && selectedWallet === wallet.name ? (
                  <Loader2 className="w-5 h-5 animate-spin text-black/50" />
                ) : (
                  <Check className="w-5 h-5 text-green-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Not Installed */}
      {notInstalledWallets.length > 0 && (
        <div>
          <p className="text-sm font-medium text-black/50 mb-2">Not Installed</p>
          <div className="space-y-2">
            {notInstalledWallets.map((wallet) => (
              <a
                key={wallet.name}
                href={wallet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 p-4 border border-black/5 rounded-xl bg-black/5 opacity-60 hover:opacity-80 transition-opacity"
              >
                <img
                  src={wallet.icon}
                  alt={wallet.name}
                  className="w-8 h-8 rounded-lg grayscale"
                />
                <span className="flex-1 text-left font-medium">{wallet.name}</span>
                <ExternalLink className="w-4 h-4 text-black/30" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* No wallets available */}
      {wallets.length === 0 && (
        <div className="text-center py-8">
          <Wallet className="w-12 h-12 text-black/20 mx-auto mb-4" />
          <p className="text-black/50">No Aptos wallets detected</p>
          <a
            href="https://petra.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-blue-600 hover:underline"
          >
            Install Petra Wallet
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
};