import { NextRequest, NextResponse } from 'next/server';
import { getQuote } from '@/lib/sideshift';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const depositCoin = searchParams.get('depositCoin');
    const settleCoin = searchParams.get('settleCoin');
    const depositAmount = searchParams.get('depositAmount');
    const settleAmount = searchParams.get('settleAmount');
    
    if (!depositCoin || !settleCoin) {
      return NextResponse.json(
        { error: 'depositCoin and settleCoin are required' },
        { status: 400 }
      );
    }
    
    const quote = await getQuote(
      depositCoin,
      settleCoin,
      depositAmount || undefined,
      settleAmount || undefined
    );
    
    return NextResponse.json({ quote }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

