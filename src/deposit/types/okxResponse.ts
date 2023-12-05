// OKX Api call response
export interface okxResponse<T> {
  status?: number;
  code: string;
  msg: string;
  data?: T | undefined;
}

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
