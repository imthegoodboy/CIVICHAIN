import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Election from '@/models/Election';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const creator = searchParams.get('creator');
    
    const query: any = {};
    if (status) query.status = status;
    if (creator) query.creatorAddress = creator.toLowerCase();
    
    const elections = await Election.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json({ elections }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    const {
      creatorAddress,
      title,
      description,
      candidates,
      votingType,
      startTime,
      endTime,
      isPrivate,
      rewardAmount,
      contractAddress,
    } = data;
    
    // Get next election ID
    const lastElection = await Election.findOne().sort({ electionId: -1 });
    const nextId = lastElection ? lastElection.electionId + 1 : 1;
    
    // Initialize votes map
    const votesMap = new Map();
    candidates.forEach((candidate: string) => {
      votesMap.set(candidate, 0);
    });
    
    const election = await Election.create({
      electionId: nextId,
      creatorAddress: creatorAddress.toLowerCase(),
      title,
      description,
      candidates,
      votingType: votingType || 'SingleChoice',
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: 'Pending',
      totalVotes: 0,
      votes: Object.fromEntries(votesMap),
      voterAddresses: [],
      isPrivate: isPrivate || false,
      rewardAmount: rewardAmount || 0,
      contractAddress: contractAddress || '',
    });
    
    return NextResponse.json(
      { message: 'Election created successfully', election },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

