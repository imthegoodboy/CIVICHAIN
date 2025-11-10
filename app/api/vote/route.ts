import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Election from '@/models/Election';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { electionId, voterAddress, candidate } = await request.json();
    
    if (!electionId || !voterAddress || !candidate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user has verified identity
    const user = await User.findOne({ walletAddress: voterAddress.toLowerCase() });
    if (!user || !user.isVerified) {
      return NextResponse.json(
        { error: 'User must have verified identity to vote' },
        { status: 403 }
      );
    }
    
    // Get election
    const election = await Election.findOne({ electionId });
    if (!election) {
      return NextResponse.json(
        { error: 'Election not found' },
        { status: 404 }
      );
    }
    
    // Check if election is active
    if (election.status !== 'Active') {
      return NextResponse.json(
        { error: 'Election is not active' },
        { status: 400 }
      );
    }
    
    // Check if user already voted
    if (election.voterAddresses.includes(voterAddress.toLowerCase())) {
      return NextResponse.json(
        { error: 'User has already voted' },
        { status: 400 }
      );
    }
    
    // Check if candidate is valid
    if (!election.candidates.includes(candidate)) {
      return NextResponse.json(
        { error: 'Invalid candidate' },
        { status: 400 }
      );
    }
    
    // Update vote count
    const currentVotes = election.votes.get(candidate) || 0;
    election.votes.set(candidate, currentVotes + 1);
    election.totalVotes += 1;
    election.voterAddresses.push(voterAddress.toLowerCase());
    
    await election.save();
    
    return NextResponse.json(
      { message: 'Vote cast successfully', election },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

