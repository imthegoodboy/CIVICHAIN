'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, Users, Vote, ArrowRight, Sparkles } from 'lucide-react';

interface Election {
  electionId: number;
  title: string;
  description: string;
  candidates: string[];
  status: string;
  startTime: string;
  endTime: string;
  totalVotes: number;
  votes: Record<string, number>;
}

export default function ElectionsPage() {
  const { address, isConnected } = useAccount();
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all');

  useEffect(() => {
    fetchElections();
  }, [filter]);

  const fetchElections = async () => {
    setLoading(true);
    try {
      const status = filter === 'all' ? '' : filter === 'active' ? 'Active' : 'Ended';
      const url = status ? `/api/elections?status=${status}` : '/api/elections';
      const res = await fetch(url);
      const data = await res.json();
      setElections(data.elections || []);
    } catch (error) {
      console.error('Error fetching elections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTopCandidate = (election: Election) => {
    const entries = Object.entries(election.votes || {});
    if (entries.length === 0) return null;
    return entries.sort((a, b) => b[1] - a[1])[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Elections</h1>
            <p className="text-gray-600">Browse and participate in active elections</p>
          </div>
          {isConnected && (
            <Link href="/create">
              <Button className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Create Election
              </Button>
            </Link>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'active' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('ended')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'ended' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Ended
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : elections.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No elections found</p>
            {isConnected && (
              <Link href="/create" className="mt-4 inline-block">
                <Button>Create First Election</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election) => {
              const topCandidate = getTopCandidate(election);
              return (
                <Link
                  key={election.electionId}
                  href={`/elections/${election.electionId}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex-1">
                      {election.title}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(election.status)}`}>
                      {election.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {election.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{election.candidates.length} candidates</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Vote className="w-4 h-4" />
                      <span>{election.totalVotes} votes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(election.endTime).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {topCandidate && election.status === 'Ended' && (
                    <div className="bg-green-50 rounded p-2 mb-4">
                      <p className="text-sm font-medium text-green-800">
                        Winner: {topCandidate[0]} ({topCandidate[1]} votes)
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center text-blue-600 font-medium text-sm">
                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

