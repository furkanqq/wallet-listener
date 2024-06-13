export interface NetworkType {
  network: string;
  ccy: string;
  chain: string;
  logo: string;
}

export const Network: NetworkType[] = [
  {
    network: 'ethereum',
    ccy: 'ETH',
    chain: 'ETH-ERC20',
    logo: '',
  },
  {
    network: 'ethereum',
    ccy: 'ETH',
    chain: 'ETH-Arbitrum One',
    logo: '',
  },
  {
    network: 'ethereum',
    ccy: 'ETH',
    chain: 'ETH-Optimism',
    logo: '',
  },
  {
    network: 'ethereum',
    ccy: 'ETH',
    chain: 'ETH-ZkSync Era',
    logo: '',
  },
  {
    network: 'ethereum',
    ccy: 'USDT',
    chain: 'USDT-ERC20',
    logo: '',
  },
  {
    network: 'ethereum',
    ccy: 'USDT',
    chain: 'USDT-Polygon',
    logo: '',
  },
  {
    network: 'ethereum',
    ccy: 'ARB',
    chain: 'ARB-Arbitrum One',
    logo: '',
  },
  {
    network: 'ethereum',
    ccy: 'ARB',
    chain: 'ARB-ERC20',
    logo: '',
  },
];
