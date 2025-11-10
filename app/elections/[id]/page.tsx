'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Clock, Users, Vote, CheckCircle, BarChart3, Sparkles, Share2, Copy } from 'lucide-react';
import axios from 'axios';

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
  voterAddresses: string[];
  isPrivate: boolean;
}

interface Analysis {
  insights: string[];
  sentiment: string;
  recommendations: string[];
}

export default function ElectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [election, setElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchElection();
    }
  }, [params.id, address]);

  const fetchElection = async () => {
    try {
      const res = await fetch(`/api/elections/${params.id}`);
      const data = await res.json();
      setElection(data.election);
      
      if (address && data.election.voterAddresses) {
        setHasVoted(data.election.voterAddresses.includes(address.toLowerCase()));
      }
    } catch (error) {
      console.error('Error fetching election:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate || !address || !isConnected) return;
    
    setVoting(true);
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          electionId: election?.electionId,
          voterAddress: address,
          candidate: selectedCandidate,
        }),
      });
      
      if (res.ok) {
        setHasVoted(true);
        await fetchElection();
        alert('Vote cast successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to cast vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to cast vote');
    } finally {
      setVoting(false);
    }
  };

  const fetchAnalysis = async () => {
    if (!election) return;
    
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ electionId: election.electionId }),
      });
      const data = await res.json();
      setAnalysis(data.analysis);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Error fetching analysis:', error);
    }
  };

  const shareElection = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (!url) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: election?.title || 'Election', url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Election not found</p>
        </div>
      </div>
    );
  }

  const votes = election.votes || {};
  const totalVotes = election.totalVotes || 0;
  const sortedCandidates = Object.entries(votes)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{election.title}</h1>
              <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                election.status === 'Active' ? 'bg-green-100 text-green-800' :
                election.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {election.status}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={fetchAnalysis}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                AI Analysis
              </Button>
              <Button
                onClick={shareElection}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">{election.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded p-3">
              <div className="text-2xl font-bold text-blue-600">{totalVotes}</div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <div className="text-2xl font-bold text-purple-600">{election.candidates.length}</div>
              <div className="text-sm text-gray-600">Candidates</div>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <div className="text-sm font-medium text-gray-900">Start</div>
              <div className="text-xs text-gray-600">{new Date(election.startTime).toLocaleDateString()}</div>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <div className="text-sm font-medium text-gray-900">End</div>
              <div className="text-xs text-gray-600">{new Date(election.endTime).toLocaleDateString()}</div>
            </div>
          </div>

          {showAnalysis && analysis && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                AI Insights
              </h3>
              <ul className="list-disc list-inside space-y-2 mb-4">
                {analysis.insights.map((insight, i) => (
                  <li key={i} className="text-gray-700">{insight}</li>
                ))}
              </ul>
              {analysis.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Recommendations:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-gray-600">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Voting Section */}
          {election.status === 'Active' && isConnected && !hasVoted && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Cast Your Vote</h3>
              <div className="space-y-3 mb-4">
                {election.candidates.map((candidate) => (
                  <label
                    key={candidate}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedCandidate === candidate
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="candidate"
                      value={candidate}
                      checked={selectedCandidate === candidate}
                      onChange={(e) => setSelectedCandidate(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-medium">{candidate}</span>
                  </label>
                ))}
              </div>
              <Button
                onClick={handleVote}
                disabled={!selectedCandidate || voting}
                className="w-full"
              >
                {voting ? 'Casting Vote...' : 'Cast Vote'}
              </Button>
            </div>
          )}

          {hasVoted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">You have already voted in this election</span>
            </div>
          )}

          {/* Results */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Results
            </h3>
            <div className="space-y-4">
              {election.candidates.map((candidate) => {
                const voteCount = votes[candidate] || 0;
                const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                const isWinner = election.status === 'Ended' && sortedCandidates[0] === candidate;
                
                return (
                  <div key={candidate} className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{candidate}</span>
                        {isWinner && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Winner
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-medium">
                        {voteCount} votes ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-4 rounded-full transition-all ${
                          isWinner ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

