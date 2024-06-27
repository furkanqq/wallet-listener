import { http, createPublicClient } from 'viem';
import { arbitrum, bsc, fantom, mainnet, opBNB } from 'viem/chains';

export const publicClient = [
  createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
  createPublicClient({
    chain: bsc,
    transport: http(),
  }),
  createPublicClient({
    chain: fantom,
    transport: http(),
  }),
  createPublicClient({
    chain: arbitrum,
    transport: http(),
  }),
  createPublicClient({
    chain: opBNB,
    transport: http(),
  }),
];
