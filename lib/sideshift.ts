import axios from 'axios';

const SIDESHIFT_API_URL = 'https://api.sideshift.ai/v2';

export interface SideShiftQuote {
  depositCoin: string;
  settleCoin: string;
  depositAmount?: string;
  settleAmount?: string;
  rate?: string;
  minDepositAmount?: string;
  maxDepositAmount?: string;
}

export interface SideShiftOrder {
  orderId: string;
  depositCoin: string;
  settleCoin: string;
  depositAmount: string;
  settleAmount: string;
  depositAddress: string;
  settleAddress: string;
  status: string;
}

/**
 * Get a quote for swapping between coins
 */
export async function getQuote(
  depositCoin: string,
  settleCoin: string,
  depositAmount?: string,
  settleAmount?: string
): Promise<SideShiftQuote> {
  try {
    const params: any = {
      depositCoin,
      settleCoin,
    };
    
    if (depositAmount) params.depositAmount = depositAmount;
    if (settleAmount) params.settleAmount = settleAmount;
    
    const response = await axios.get(`${SIDESHIFT_API_URL}/quotes`, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(`SideShift API error: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * Create a new swap order
 */
export async function createOrder(
  depositCoin: string,
  settleCoin: string,
  depositAmount: string,
  settleAddress: string,
  refundAddress?: string
): Promise<SideShiftOrder> {
  try {
    const response = await axios.post(`${SIDESHIFT_API_URL}/orders`, {
      depositCoin,
      settleCoin,
      depositAmount,
      settleAddress,
      refundAddress,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`SideShift API error: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * Get order status
 */
export async function getOrderStatus(orderId: string): Promise<SideShiftOrder> {
  try {
    const response = await axios.get(`${SIDESHIFT_API_URL}/orders/${orderId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(`SideShift API error: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * Get available coins
 */
export async function getAvailableCoins(): Promise<string[]> {
  try {
    const response = await axios.get(`${SIDESHIFT_API_URL}/coins`);
    return response.data;
  } catch (error: any) {
    // Return common coins if API fails
    return ['BTC', 'ETH', 'USDC', 'USDT', 'MATIC', 'BNB', 'AVAX', 'SOL'];
  }
}

