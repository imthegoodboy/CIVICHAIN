import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Election from '@/models/Election';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const election = await Election.findOne({ electionId: parseInt(id) });
    if (!election) {
      return NextResponse.json({ error: 'Election not found' }, { status: 404 });
    }

    election.status = 'Active';
    await election.save();

    return NextResponse.json({ message: 'Election started', election }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
