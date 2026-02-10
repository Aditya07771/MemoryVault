// Petra Wallet Service for Aptos
import { toast } from '@/hooks/use-toast';

// Petra wallet interface
// interface PetraWallet {
//   connect: () => Promise<{ address: string; publicKey: string }>;
//   disconnect: () => Promise<void>;
//   isConnected: () => Promise<boolean>;
//   account: () => Promise<{ address: string; publicKey: string }>;
//   signMessage: (payload: { message: string; nonce: string }) => Promise<{
//     fullMessage: string;
//     message: string;
//     nonce: string;
//     prefix: string;
//     signature: string;
//   }>;
//   signAndSubmitTransaction: (transaction: any) => Promise<{ hash: string }>;
//   network: () => Promise<string>;
//   onAccountChange: (callback: (account: { address: string; publicKey: string } | null) => void) => void;
//   onNetworkChange: (callback: (network: { name: string; chainId: string }) => void) => void;
// }

declare global {
  interface Window {
    aptos?: PetraWallet;
    petra?: PetraWallet;
  }
}

class WalletService {
  private wallet: PetraWallet | null = null;
  private connected: boolean = false;
  private address: string | null = null;
  private publicKey: string | null = null;

  constructor() {
    // Check for wallet on initialization
    if (typeof window !== 'undefined') {
      this.wallet = window.aptos || window.petra || null;
    }
  }

  /**
   * Check if Petra wallet is installed
   */
  isPetraInstalled(): boolean {
    return !!(window.aptos || window.petra);
  }

  /**
   * Get the Petra wallet instance
   */
  private getWallet(): PetraWallet {
    const wallet = window.aptos || window.petra;
    if (!wallet) {
      throw new Error('Petra wallet is not installed');
    }
    return wallet;
  }

  /**
   * Connect to Petra wallet
   */
  async connect(): Promise<{ address: string; publicKey: string }> {
    try {
      if (!this.isPetraInstalled()) {
        // Open Petra download page
        window.open('https://petra.app/', '_blank');
        throw new Error('Please install Petra wallet');
      }

      const wallet = this.getWallet();
      const response = await wallet.connect();
      
      this.connected = true;
      this.address = response.address;
      this.publicKey = response.publicKey;
      this.wallet = wallet;

      console.log('✅ Petra wallet connected:', response.address);
      
      return response;
    } catch (error: any) {
      console.error('❌ Wallet connection failed:', error);
      throw new Error(error.message || 'Failed to connect wallet');
    }
  }

  /**
   * Disconnect from Petra wallet
   */
  async disconnect(): Promise<void> {
    try {
      if (this.wallet && this.connected) {
        await this.wallet.disconnect();
      }
      this.connected = false;
      this.address = null;
      this.publicKey = null;
      console.log('✅ Wallet disconnected');
    } catch (error) {
      console.error('❌ Wallet disconnect failed:', error);
    }
  }

  /**
   * Check if wallet is connected
   */
  async isConnected(): Promise<boolean> {
    try {
      if (!this.isPetraInstalled()) return false;
      const wallet = this.getWallet();
      return await wallet.isConnected();
    } catch {
      return false;
    }
  }

  /**
   * Get current account
   */
  async getAccount(): Promise<{ address: string; publicKey: string } | null> {
    try {
      if (!this.isPetraInstalled()) return null;
      const wallet = this.getWallet();
      const isConnected = await wallet.isConnected();
      if (!isConnected) return null;
      return await wallet.account();
    } catch {
      return null;
    }
  }

  /**
   * Get wallet address
   */
  getAddress(): string | null {
    return this.address;
  }

  /**
   * Get public key
   */
  getPublicKey(): string | null {
    return this.publicKey;
  }

  /**
   * Sign a message for authentication
   */
  async signMessage(message: string): Promise<{
    signature: string;
    fullMessage: string;
    nonce: string;
  }> {
    try {
      if (!this.isPetraInstalled()) {
        throw new Error('Petra wallet is not installed');
      }

      const wallet = this.getWallet();
      const isConnected = await wallet.isConnected();
      
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      // Generate a random nonce
      const nonce = Date.now().toString() + Math.random().toString(36).substring(2);
      
      const response = await wallet.signMessage({
        message,
        nonce
      });

      console.log('✅ Message signed successfully');
      
      return {
        signature: response.signature,
        fullMessage: response.fullMessage,
        nonce: response.nonce
      };
    } catch (error: any) {
      console.error('❌ Message signing failed:', error);
      throw new Error(error.message || 'Failed to sign message');
    }
  }

  /**
   * Sign and submit a transaction
   */
  async signAndSubmitTransaction(payload: any): Promise<{ hash: string }> {
    try {
      const wallet = this.getWallet();
      const isConnected = await wallet.isConnected();
      
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      const response = await wallet.signAndSubmitTransaction(payload);
      console.log('✅ Transaction submitted:', response.hash);
      
      return response;
    } catch (error: any) {
      console.error('❌ Transaction failed:', error);
      throw new Error(error.message || 'Transaction failed');
    }
  }

  /**
   * Get current network
   */
  async getNetwork(): Promise<string> {
    try {
      const wallet = this.getWallet();
      return await wallet.network();
    } catch {
      return 'unknown';
    }
  }

  /**
   * Listen for account changes
   */
  onAccountChange(callback: (account: { address: string; publicKey: string } | null) => void): void {
    if (this.isPetraInstalled()) {
      const wallet = this.getWallet();
      wallet.onAccountChange(callback);
    }
  }

  /**
   * Listen for network changes
   */
  onNetworkChange(callback: (network: { name: string; chainId: string }) => void): void {
    if (this.isPetraInstalled()) {
      const wallet = this.getWallet();
      wallet.onNetworkChange(callback);
    }
  }

  /**
   * Generate authentication message
   */
  generateAuthMessage(address: string): string {
    const timestamp = Date.now();
    return `Sign this message to authenticate with LifeVault.\n\nWallet: ${address}\nTimestamp: ${timestamp}\n\nThis signature will not trigger any blockchain transaction or cost any gas fees.`;
  }
}

// Export singleton instance
export const walletService = new WalletService();
export default walletService;