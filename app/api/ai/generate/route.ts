import { NextRequest, NextResponse } from 'next/server';
import { generateElectionDescription } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { title, type } = await request.json();
    
    if (!title) {
      return NextResponse.json(
        { error: 'title is required' },
        { status: 400 }
      );
    }
    
    const description = await generateElectionDescription(title, type || 'SingleChoice');
    
    return NextResponse.json({ description }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

