'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [paymentCoin, setPaymentCoin] = useState('ETH');
  const [quote, setQuote] = useState<any>(null);

  const checkRegistration = async () => {
    if (!address) return;
    try {
      const res = await fetch(`/api/users/register?walletAddress=${address}`);
      const data = await res.json();
      if (data.user?.isVerified) {
        setRegistered(true);
      }
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const fetchQuote = async () => {
    if (!paymentCoin) return;
    try {
      const res = await fetch(`/api/sideshift/quote?depositCoin=${paymentCoin}&settleCoin=USDC&depositAmount=2`);
      const data = await res.json();
      setQuote(data.quote);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  useEffect(() => {
    if (address) {
      checkRegistration();
    }
  }, [address]);

  useEffect(() => {
    if (paymentCoin) {
      fetchQuote();
    }
  }, [paymentCoin]);

  const handleRegister = async () => {
    if (!address || !isConnected) {
      alert('Please connect your wallet');
      return;
    }

    setLoading(true);
    try {
      // Register user in database
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          metadata: `Identity registered on ${new Date().toISOString()}`,
        }),
      });

      if (res.ok) {
        setRegistered(true);
        alert('Identity registered successfully!');
        router.push('/elections');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to register');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600 mb-4">Please connect your wallet to register</p>
        </div>
      </div>
    );
  }

  if (registered) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Identity Verified!</h1>
            <p className="text-gray-600 mb-6">
              Your identity has been registered and verified. You can now participate in elections.
            </p>
            <Button onClick={() => router.push('/elections')} size="lg">
              Go to Elections <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Register Your Identity</h1>
            <p className="text-gray-600">
              Get your Soulbound NFT identity to participate in elections
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold mb-2">What is a Soulbound NFT?</h3>
              <p className="text-sm text-gray-700">
                A Soulbound NFT is a non-transferable identity token that proves you are a verified citizen.
                Once minted, it cannot be transferred or sold, ensuring one person = one identity.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method (via SideShift)
              </label>
              <select
                value={paymentCoin}
                onChange={(e) => {
                  setPaymentCoin(e.target.value);
                  fetchQuote();
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ETH">Ethereum (ETH)</option>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="MATIC">Polygon (MATIC)</option>
                <option value="USDC">USD Coin (USDC)</option>
                <option value="USDT">Tether (USDT)</option>
              </select>
            </div>

            {quote && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Registration Fee:</span>
                  <span className="font-semibold">2 USDC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pay with {paymentCoin}:</span>
                  <span className="font-semibold">
                    {quote.depositAmount || 'Calculating...'} {paymentCoin}
                  </span>
                </div>
                {quote.rate && (
                  <p className="text-xs text-gray-500 mt-2">
                    Rate: 1 USDC = {quote.rate} {paymentCoin}
                  </p>
                )}
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> For demo purposes, registration is free. In production, 
                you would pay the fee and receive a Soulbound NFT on-chain.
              </p>
            </div>

            <Button
              onClick={handleRegister}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Registering...' : 'Register Identity'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

