// OKX Api call response
export interface okxResponse<T> {
  status?: number;
  code: string;
  msg: string;
  data?: T | undefined;
}
