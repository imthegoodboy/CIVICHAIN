import { NextRequest, NextResponse } from 'next/server';
import { analyzeElection } from '@/lib/ai';
import connectDB from '@/lib/mongodb';
import Election from '@/models/Election';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { electionId } = await request.json();
    
    if (!electionId) {
      return NextResponse.json(
        { error: 'electionId is required' },
        { status: 400 }
      );
    }
    
    const election = await Election.findOne({ electionId });
    if (!election) {
      return NextResponse.json(
        { error: 'Election not found' },
        { status: 404 }
      );
    }
    
    const votes: Record<string, number> = {};
    election.votes.forEach((value: number, key: string) => {
      votes[key] = value;
    });
    
    const analysis = await analyzeElection({
      title: election.title,
      description: election.description,
      candidates: election.candidates,
      totalVotes: election.totalVotes,
      votes,
    });
    
    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

