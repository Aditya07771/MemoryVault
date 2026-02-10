import React, { createContext, useContext, ReactNode, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import {
  AptosWalletAdapterProvider,
  useWallet as useAptosWallet,
  InputTransactionData,
  WalletReadyState
} from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk';
import api from '@/services/api';

interface WalletAccount {
  address: string;
  publicKey: string;
}

interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  wallet: any;
  wallets: readonly any[];
  account: WalletAccount | null;
  network: {
    name: string;
    chainId?: number;
    url?: string;
  } | null;
  connect: (walletName?: string) => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: (message: string) => Promise<{
    signature: string;
    fullMessage: string;
    nonce: string;
    message: string;
  }>;
  signAndSubmitTransaction: (transaction: InputTransactionData) => Promise<{ hash: string }>;
  authenticateWithWallet: () => Promise<{ success: boolean; token?: string; error?: string }>;
  linkWalletToAccount: () => Promise<{ success: boolean; error?: string }>;
  isPetraInstalled: boolean;
  isWalletReady: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

const checkPetraInWindow = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window.aptos || window.petra || (window as any).aptosWallet);
};

/**
 * Helper to convert various formats to hex string
 */
const toHexString = (data: any): string => {
  if (!data) return '';
  
  if (typeof data === 'string') {
    return data.startsWith('0x') ? data : `0x${data}`;
  }
  
  if (data instanceof Uint8Array) {
    return '0x' + Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  if (Array.isArray(data)) {
    return '0x' + data.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  if (typeof data === 'object') {
    // Handle {key: Uint8Array} format
    if (data.key) return toHexString(data.key);
    // Handle {data: Uint8Array} format
    if (data.data) return toHexString(data.data);
    // Handle object with numeric keys (array-like)
    const keys = Object.keys(data);
    if (keys.every(k => !isNaN(Number(k)))) {
      const arr = keys.map(k => data[k]);
      return '0x' + arr.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  }
  
  return String(data);
};

const WalletContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    connect: aptosConnect,
    disconnect: aptosDisconnect,
    account: aptosAccount,
    connected,
    connecting,
    disconnecting,
    wallet,
    wallets,
    network,
    signMessage: aptosSignMessage,
    signAndSubmitTransaction: aptosSignAndSubmitTransaction,
  } = useAptosWallet();

  const [petraChecked, setPetraChecked] = useState(false);
  const [petraInWindow, setPetraInWindow] = useState(false);
  
  // Use ref to always have access to latest account
  const accountRef = useRef(aptosAccount);
  
  // Update ref when account changes
  useEffect(() => {
    accountRef.current = aptosAccount;
    if (aptosAccount) {
      console.log('Account updated:', {
        address: aptosAccount.address?.toString(),
        publicKey: toHexString(aptosAccount.publicKey)
      });
    }
  }, [aptosAccount]);

  // Process account into consistent format
  const account = useMemo((): WalletAccount | null => {
    if (!aptosAccount?.address) return null;
    
    const address = aptosAccount.address.toString();
    const publicKey = toHexString(aptosAccount.publicKey);
    
    return { address, publicKey };
  }, [aptosAccount]);

  useEffect(() => {
    const checkPetra = () => {
      const hasPetra = checkPetraInWindow();
      setPetraInWindow(hasPetra);
      setPetraChecked(true);
      if (hasPetra) {
        console.log('✅ Petra wallet detected');
      }
    };

    checkPetra();
    const timer1 = setTimeout(checkPetra, 100);
    const timer2 = setTimeout(checkPetra, 500);
    const timer3 = setTimeout(checkPetra, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const petraInAdapter = useMemo(() => {
    if (!wallets || wallets.length === 0) return false;
    return wallets.some(w => {
      const name = w.name?.toLowerCase() || '';
      const readyState = w.readyState;
      const isPetra = name.includes('petra');
      const isInstalled = readyState === WalletReadyState.Installed || 
                          readyState === 'Installed' ||
                          readyState === WalletReadyState.Loadable ||
                          readyState === 'Loadable';
      return isPetra && isInstalled;
    });
  }, [wallets]);

  const isPetraInstalled = useMemo(() => {
    return petraInAdapter || petraInWindow;
  }, [petraInAdapter, petraInWindow]);

  const isWalletReady = useMemo(() => {
    return petraChecked && (wallets.length > 0 || petraInWindow);
  }, [petraChecked, wallets.length, petraInWindow]);

  const findPetraWallet = useCallback(() => {
    if (!wallets || wallets.length === 0) return null;
    return wallets.find(w => {
      const name = w.name?.toLowerCase() || '';
      return name.includes('petra');
    });
  }, [wallets]);

  // Wait for account to be available
  const waitForAccount = useCallback(async (maxWait = 5000): Promise<WalletAccount | null> => {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWait) {
      const currentAccount = accountRef.current;
      if (currentAccount?.address) {
        return {
          address: currentAccount.address.toString(),
          publicKey: toHexString(currentAccount.publicKey)
        };
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return null;
  }, []);

  const connect = useCallback(async (walletName?: string) => {
    try {
      console.log('🔗 Connecting to wallet...');
      const petraWallet = findPetraWallet();
      
      if (petraWallet) {
        console.log('Found Petra wallet:', petraWallet.name);
        await aptosConnect(petraWallet.name);
      } else if (walletName) {
        await aptosConnect(walletName);
      } else {
        const namesToTry = ['Petra', 'petra', 'Petra Wallet'];
        let connectSuccess = false;
        
        for (const name of namesToTry) {
          try {
            await aptosConnect(name);
            connectSuccess = true;
            break;
          } catch (e) {
            console.log(`Failed with name "${name}"`);
          }
        }
        
        if (!connectSuccess) {
          throw new Error('Could not find Petra wallet');
        }
      }
      
      console.log('✅ Wallet connected');
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      throw error;
    }
  }, [aptosConnect, findPetraWallet]);

  const disconnect = useCallback(async () => {
    try {
      await aptosDisconnect();
      console.log('✅ Wallet disconnected');
    } catch (error) {
      console.error('❌ Failed to disconnect:', error);
      throw error;
    }
  }, [aptosDisconnect]);

  const signMessage = useCallback(async (message: string) => {
    const currentAccount = accountRef.current;
    
    if (!connected || !currentAccount) {
      throw new Error('Wallet not connected');
    }

    const nonce = Date.now().toString() + Math.random().toString(36).substring(2);
    
    console.log('📝 Signing message...');
    console.log('Message:', message);
    console.log('Nonce:', nonce);
    
    const response = await aptosSignMessage({
      message,
      nonce,
    });

    console.log('📝 Raw sign response:', response);

    // Handle signature - it might be in different formats
    let signature = '';
    if (response.signature) {
      signature = toHexString(response.signature);
    } else if ((response as any).signedMessage) {
      signature = toHexString((response as any).signedMessage);
    }

    // Ensure signature is in correct format (remove 0x if present for backend)
    const cleanSignature = signature.startsWith('0x') ? signature.slice(2) : signature;

    console.log('📝 Processed signature:', cleanSignature);

    return {
      signature: cleanSignature,
      fullMessage: response.fullMessage || message,
      nonce: response.nonce || nonce,
      message: message,
    };
  }, [connected, aptosSignMessage]);

  const signAndSubmitTransaction = useCallback(async (transaction: InputTransactionData) => {
    if (!connected) {
      throw new Error('Wallet not connected');
    }
    const response = await aptosSignAndSubmitTransaction(transaction);
    return { hash: response.hash };
  }, [connected, aptosSignAndSubmitTransaction]);

  const generateAuthMessage = useCallback((address: string) => {
    const timestamp = Date.now();
    return `Sign this message to authenticate with LifeVault.\n\nWallet: ${address}\nTimestamp: ${timestamp}\n\nThis signature will not trigger any blockchain transaction or cost any gas fees.`;
  }, []);

  const authenticateWithWallet = useCallback(async () => {
    try {
      console.log('\n=== Starting Wallet Authentication ===');
      console.log('Connected:', connected);
      console.log('Account:', account);
      
      // If not connected, connect first
      if (!connected) {
        console.log('Not connected, connecting...');
        await connect();
      }
      
      // Wait for account to be available
      console.log('Waiting for account...');
      const walletAccount = await waitForAccount();
      
      if (!walletAccount) {
        console.error('No account after waiting');
        return { success: false, error: 'Could not get wallet account. Please try again.' };
      }

      console.log('Got account:', walletAccount);

      const { address, publicKey } = walletAccount;

      if (!address || !publicKey) {
        console.error('Missing address or publicKey:', { address, publicKey });
        return { success: false, error: 'Invalid wallet account data' };
      }

      const message = generateAuthMessage(address);
      console.log('Auth message:', message);
      
      const signResult = await signMessage(message);
      console.log('Sign result:', signResult);

      if (!signResult.signature) {
        console.error('No signature returned');
        return { success: false, error: 'Failed to sign message' };
      }

      // Clean up publicKey and signature - remove 0x prefix
      const cleanPublicKey = publicKey.startsWith('0x') ? publicKey.slice(2) : publicKey;
      const cleanSignature = signResult.signature.startsWith('0x') ? signResult.signature.slice(2) : signResult.signature;

      // Prepare request data
      const requestData = {
        address: address,
        publicKey: cleanPublicKey,
        signature: cleanSignature,
        message: signResult.message,
        fullMessage: signResult.fullMessage,
        nonce: signResult.nonce,
      };

      console.log('Sending to backend:', {
        ...requestData,
        signature: requestData.signature.substring(0, 20) + '...',
        publicKey: requestData.publicKey.substring(0, 20) + '...'
      });

      const response = await api.post('/auth/wallet', requestData);

      console.log('Backend response:', response.data);

      const { token } = response.data.data;
      localStorage.setItem('token', token);

      return { success: true, token };
    } catch (error: any) {
      console.error('❌ Wallet authentication failed:', error);
      console.error('Error response:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Authentication failed',
      };
    }
  }, [connected, account, connect, waitForAccount, signMessage, generateAuthMessage]);

  const linkWalletToAccount = useCallback(async () => {
    try {
      console.log('\n=== Starting Wallet Linking ===');
      
      if (!connected) {
        await connect();
      }
      
      const walletAccount = await waitForAccount();
      
      if (!walletAccount) {
        return { success: false, error: 'Could not get wallet account' };
      }

      const { address, publicKey } = walletAccount;

      const message = `Link this wallet to your LifeVault account.\n\nWallet: ${address}\nTimestamp: ${Date.now()}`;
      const signResult = await signMessage(message);

      // Clean up publicKey and signature
      const cleanPublicKey = publicKey.startsWith('0x') ? publicKey.slice(2) : publicKey;
      const cleanSignature = signResult.signature.startsWith('0x') ? signResult.signature.slice(2) : signResult.signature;

      const requestData = {
        address: address,
        publicKey: cleanPublicKey,
        signature: cleanSignature,
        message: signResult.message,
        fullMessage: signResult.fullMessage,
        nonce: signResult.nonce,
      };

      console.log('Sending to backend:', requestData);

      await api.post('/auth/link-wallet', requestData);

      return { success: true };
    } catch (error: any) {
      console.error('❌ Wallet linking failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to link wallet',
      };
    }
  }, [connected, connect, waitForAccount, signMessage]);

  const value: WalletContextType = {
    connected,
    connecting,
    disconnecting,
    wallet,
    wallets,
    account,
    network: network ? {
      name: network.name,
      chainId: network.chainId,
      url: network.url,
    } : null,
    connect,
    disconnect,
    signMessage,
    signAndSubmitTransaction,
    authenticateWithWallet,
    linkWalletToAccount,
    isPetraInstalled,
    isWalletReady,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

declare global {
  interface Window {
    aptos?: any;
    petra?: any;
    aptosWallet?: any;
  }
}

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network: Network.TESTNET,
        aptosApiKey: import.meta.env.VITE_APTOS_API_KEY,
        aptosConnect: {
          dappId: 'lifevault',
        },
      }}
      onError={(error) => {
        console.error('Wallet adapter error:', error);
      }}
    >
      <WalletContextProvider>
        {children}
      </WalletContextProvider>
    </AptosWalletAdapterProvider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};