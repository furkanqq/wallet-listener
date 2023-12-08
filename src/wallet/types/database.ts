// deposit address
export interface DepositAddress {
  chain: string;
  ctAddr: string;
  ccy: string;
  to: string;
  addr: string;
  selected: boolean;
  owner: string | undefined;
}
