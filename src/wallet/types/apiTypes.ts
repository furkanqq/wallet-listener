import { GetMainAccountBalanceResponse } from 'okx-api-connect/types/responses';

export interface ApiResponse<T> {
  status: number;
  code: string;
  message: string;
  data?: T;
}
