import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrderStatus } from '@/lib/sideshift';

export async function POST(request: NextRequest) {
  try {
    const { depositCoin, settleCoin, depositAmount, settleAddress, refundAddress } = await request.json();
    
    if (!depositCoin || !settleCoin || !depositAmount || !settleAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const order = await createOrder(
      depositCoin,
      settleCoin,
      depositAmount,
      settleAddress,
      refundAddress
    );
    
    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId is required' },
        { status: 400 }
      );
    }
    
    const order = await getOrderStatus(orderId);
    
    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

