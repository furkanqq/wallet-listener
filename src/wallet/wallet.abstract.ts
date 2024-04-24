import {
  GetMainAccountBalanceResponse,
  TradingAccountBalanceDetails,
} from 'okx-api-connect/types/responses';

export interface BalanceResponse {
  usdtEqual: string | number;
  balanceList: TradingAccountBalanceDetails[] | GetMainAccountBalanceResponse[];
}
