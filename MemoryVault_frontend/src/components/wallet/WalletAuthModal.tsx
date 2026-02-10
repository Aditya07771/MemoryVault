import React, { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  Wallet,
  Shield,
  Check,
  Loader2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

interface WalletAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'link';
}

type Step = 'detecting' | 'connect' | 'sign' | 'success' | 'error';

export const WalletAuthModal: React.FC<WalletAuthModalProps> = ({
  isOpen,
  onClose,
  mode,
}) => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const {
    connected,
    connecting,
    account,
    isPetraInstalled,
    isWalletReady,
    connect,
    authenticateWithWallet,
    linkWalletToAccount,
  } = useWallet();

  const [step, setStep] = useState<Step>('detecting');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine initial step
  useEffect(() => {
    if (!isOpen) return;
    
    setError(null);
    setLoading(false);

    const determineStep = () => {
      if (connected && account) {
        setStep('sign');
      } else if (isPetraInstalled || isWalletReady) {
        setStep('connect');
      } else {
        setStep('detecting');
      }
    };

    // Immediate check
    determineStep();

    // Delayed check for wallet detection
    const timer = setTimeout(() => {
      if (step === 'detecting') {
        setStep('connect');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Update step when connection changes
  useEffect(() => {
    if (!isOpen) return;
    
    if (connected && account && step === 'connect') {
      console.log('Connected with account, moving to sign step');
      setStep('sign');
    }
  }, [connected, account, step, isOpen]);

  if (!isOpen) return null;

  const handleConnect = async () => {
    setError(null);
    try {
      console.log('Connecting wallet...');
      await connect();
      // Don't set step here - the useEffect will handle it when account is available
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const handleSign = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Starting sign process...');
      let result;

      if (mode === 'login') {
        result = await authenticateWithWallet();
      } else {
        result = await linkWalletToAccount();
      }

      console.log('Auth result:', result);

      if (result.success) {
        setStep('success');

        if (mode === 'link' && account?.address) {
          updateUser({ aptosAddress: account.address });
        }

        setTimeout(() => {
          onClose();
          if (mode === 'login') {
            navigate('/dashboard');
            // Force refresh to update auth state
            window.location.reload();
          }
        }, 1500);
      } else {
        setError(result.error || 'Authentication failed');
        setStep('error');
      }
    } catch (err: any) {
      console.error('Sign error:', err);
      setError(err.message || 'Something went wrong');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    if (connected && account) {
      setStep('sign');
    } else if (isPetraInstalled) {
      setStep('connect');
    } else {
      setStep('detecting');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-black">
                {mode === 'login' ? 'Sign in with Wallet' : 'Link Your Wallet'}
              </h2>
              <p className="text-sm text-black/50">
                {mode === 'login' ? 'Use Petra wallet to authenticate' : 'Connect Petra to your account'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Step Indicator */}
          {!['detecting', 'error'].includes(step) && (
            <div className="flex items-center justify-center gap-3 mb-8">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step === 'connect'
                    ? 'bg-black text-white'
                    : ['sign', 'success'].includes(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-black/10 text-black/50'
                }`}
              >
                {['sign', 'success'].includes(step) ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <div className={`w-16 h-0.5 transition-colors ${['sign', 'success'].includes(step) ? 'bg-green-500' : 'bg-black/10'}`} />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step === 'sign'
                    ? 'bg-black text-white'
                    : step === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-black/10 text-black/50'
                }`}
              >
                {step === 'success' ? <Check className="w-4 h-4" /> : '2'}
              </div>
            </div>
          )}

          {/* Step: Detecting */}
          {step === 'detecting' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-black animate-spin" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Detecting Wallet</h3>
              <p className="text-black/50">Looking for Petra wallet...</p>
            </div>
          )}

          {/* Step: Connect (Not Installed) */}
          {step === 'connect' && !isPetraInstalled && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Petra Wallet Required</h3>
              <p className="text-black/50 mb-6">Please install Petra wallet to continue</p>
              <a
                href="https://petra.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/80 mb-4"
              >
                Install Petra Wallet
                <ExternalLink className="w-4 h-4" />
              </a>
              <div>
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-black"
                >
                  <RefreshCw className="w-4 h-4" />
                  Already installed? Click to refresh
                </button>
              </div>
            </div>
          )}

          {/* Step: Connect (Installed) */}
          {step === 'connect' && isPetraInstalled && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-black/50 mb-6">Click below to connect your Petra wallet</p>
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-black/80 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {connecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Connect Petra
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              {/* Debug info */}
              <div className="mt-4 text-xs text-black/30">
                Connected: {connected ? 'Yes' : 'No'} | 
                Account: {account?.address ? 'Yes' : 'No'}
              </div>
            </div>
          )}

          {/* Step: Sign */}
          {step === 'sign' && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sign Message</h3>
              {account?.address && (
                <div className="mb-4">
                  <p className="text-sm text-black/50">Connected wallet:</p>
                  <p className="font-mono text-sm bg-black/5 rounded-lg px-3 py-2 mt-1">
                    {truncateAddress(account.address)}
                  </p>
                </div>
              )}
              <p className="text-black/50 mb-6">
                Sign a message to verify ownership. This won't cost any gas.
              </p>
              <button
                onClick={handleSign}
                disabled={loading || !account}
                className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-black/80 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Waiting for signature...
                  </>
                ) : (
                  <>
                    Sign Message
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-green-600">
                {mode === 'login' ? 'Successfully Authenticated!' : 'Wallet Linked Successfully!'}
              </h3>
              <p className="text-black/50">
                {mode === 'login' ? 'Redirecting to your dashboard...' : 'Your wallet is now connected'}
              </p>
            </div>
          )}

          {/* Step: Error */}
          {step === 'error' && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">Authentication Failed</h3>
              <p className="text-black/50 mb-2">{error || 'Something went wrong.'}</p>
              <p className="text-xs text-black/30 mb-6">Please check the console for details.</p>
              <button
                onClick={handleRetry}
                className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-black/80 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            </div>
          )}

          {/* Inline error */}
          {error && !['error', 'success'].includes(step) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-black/30 mt-0.5" />
              <div>
                <p className="text-xs text-black/50">
                  <strong className="text-black/70">Secure & Gas-Free</strong>
                  <br />
                  Signing only proves wallet ownership. No blockchain transaction or gas fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};