'use client';

import Link from 'next/link';
import { useAccount, useConnect } from 'wagmi';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Shield, Vote, Lock, Zap, Globe, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [stats, setStats] = useState({ elections: 0, voters: 0, active: 0 });

  useEffect(() => {
    // Fetch stats
    fetch('/api/elections')
      .then(res => res.json())
      .then(data => {
        setStats({
          elections: data.elections?.length || 0,
          voters: 0,
          active: data.elections?.filter((e: any) => e.status === 'Active').length || 0,
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Trustless Democracy for a Trustless World
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            CIVICHAIN combines blockchain identity, zero-knowledge privacy, and on-chain governance 
            to create transparent, tamper-proof elections.
          </p>
          <div className="flex gap-4 justify-center">
            {!isConnected ? (
              <Button
                onClick={() => connect({ connector: connectors[0] })}
                size="lg"
                className="text-lg px-8"
              >
                Get Started
              </Button>
            ) : (
              <Link href="/elections">
                <Button size="lg" className="text-lg px-8">
                  View Elections
                </Button>
              </Link>
            )}
            <Link href="/create">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Create Election
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{stats.elections}</div>
            <div className="text-gray-600">Total Elections</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">{stats.active}</div>
            <div className="text-gray-600">Active Elections</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{stats.voters}</div>
            <div className="text-gray-600">Verified Voters</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <Shield className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Decentralized ID</h3>
            <p className="text-gray-600">
              Soulbound NFTs verify your identity on-chain. Non-transferable, secure, and permanent.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <Vote className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">On-Chain Voting</h3>
            <p className="text-gray-600">
              Transparent, tamper-proof elections recorded permanently on the blockchain.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <Lock className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Zero-Knowledge Privacy</h3>
            <p className="text-gray-600">
              Your vote is private, but the results are verifiable by anyone.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <Zap className="w-12 h-12 text-yellow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">DAO Governance</h3>
            <p className="text-gray-600">
              Automate election creation and result counting for governments and DAOs.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <Globe className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Cross-Chain Payments</h3>
            <p className="text-gray-600">
              Pay and receive rewards in any cryptocurrency via SideShift integration.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <TrendingUp className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
            <p className="text-gray-600">
              Get intelligent analysis and predictions about election trends and outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Register Your Identity</h3>
              <p className="text-gray-600">
                Connect your wallet and verify your identity to receive a Soulbound NFT. 
                Pay the registration fee in any cryptocurrency - SideShift automatically converts it.
              </p>
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Create or Join Elections</h3>
              <p className="text-gray-600">
                Governments and DAOs can create verified elections. Citizens can browse 
                and participate in active elections.
              </p>
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Cast Your Vote</h3>
              <p className="text-gray-600">
                Vote securely with your verified identity. Your choice is private but 
                the tally is transparent and immutable on the blockchain.
              </p>
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              4
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">View Results & Rewards</h3>
              <p className="text-gray-600">
                Results are published on-chain and stored on IPFS. Receive rewards in 
                your preferred cryptocurrency automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">CIVICHAIN</h3>
          <p className="text-gray-400 mb-4">
            Trustless democracy for a trustless world.
          </p>
          <p className="text-sm text-gray-500">
            © 2025 CIVICHAIN. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
