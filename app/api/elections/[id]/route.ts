import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Election from '@/models/Election';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await context.params;
    const election = await Election.findOne({ electionId: parseInt(id) });
    
    if (!election) {
      return NextResponse.json(
        { error: 'Election not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ election }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const data = await request.json();
    const { id } = await context.params;
    const election = await Election.findOneAndUpdate(
      { electionId: parseInt(id) },
      { $set: data },
      { new: true }
    );
    
    if (!election) {
      return NextResponse.json(
        { error: 'Election not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Election updated successfully', election },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

