import { http, createPublicClient, webSocket } from 'viem';
import { arbitrum, bsc, bscTestnet, fantom, mainnet, opBNB } from 'viem/chains';

export const publicClient = [
  createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
  createPublicClient({
    chain: bsc,
    // transport: http(),
    transport: http('https://bsc-dataseed2.binance.org/'),
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

// export const nativeClient = [
//   // createPublicClient({
//   //   chain: mainnet,
//   //   transport: webSocket(
//   //     'wss://mainnet.infura.io/ws/v3/8e937134d5424fac87beac173a07fe56',
//   //   ),
//   // }),
//   createPublicClient({
//     chain: bsc,
//     transport: webSocket('wss://bsc-rpc.publicnode.com'), // Binance Smart Chain
//   }),
//   // createPublicClient({
//   //   chain: fantom,
//   //   transport: webSocket('wss://fantom-rpc.publicnode.com'), // Fantom
//   // }),
//   // createPublicClient({
//   //   chain: arbitrum,
//   //   transport: webSocket('wss://arb1.arbitrum.io/ws'), // Arbitrum
//   // }),
//   // createPublicClient({
//   //   chain: opBNB,
//   //   transport: webSocket('wss://opbnb-mainnet.nodeprovider.com/ws'), // OpBNB
//   // }),
//   // createPublicClient({
//   //   chain: bscTestnet,
//   //   transport: webSocket(
//   //     'wss://quick-nameless-putty.bsc-testnet.quiknode.pro/c78675dda581df23e183e7744ecf3e6b437204bc/',
//   //   ),
//   // }),
// ];

export const nativeClient = createPublicClient({
  chain: bsc,
  transport: webSocket('wss://bsc-rpc.publicnode.com'), // Binance Smart Chain
});

export const nativeClient2 = createPublicClient({
  chain: bsc,
  transport: http(),
});
