'use client';

export const dynamic = 'force-dynamic';

import Navbar from '@/components/Navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">About CIVICHAIN</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          CIVICHAIN is a decentralized voting & identity platform combining blockchain identity, zero-knowledge privacy, and on-chain governance.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">Key pillars:</p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
          <li>Decentralized ID (Soulbound NFT)</li>
          <li>On-Chain Voting (transparent & tamper-proof)</li>
          <li>Zero-Knowledge Privacy</li>
          <li>DAO Governance</li>
          <li>SideShift cross-chain payments</li>
        </ul>
      </div>
    </div>
  );
}
