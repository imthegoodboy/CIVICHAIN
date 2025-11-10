import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

const baseConnectors = [injected(), metaMask()];

const connectors = () => {
  const list = [...baseConnectors];
  if (typeof window !== 'undefined' && projectId) {
    list.push(walletConnect({ projectId }));
  }
  return list;
};

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
  connectors,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

