import { Address } from 'viem';

export const splitAddress = (address: string): Address => {
  return ('0x' + address.slice(-40)) as Address;
};
