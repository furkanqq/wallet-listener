// deposit address
export interface Coin {
  id: string;
  canDep: boolean;
  canInternal: boolean;
  canWd: boolean;
  ccy: string;
  chain: string;
  depQuotaFixed: string;
  depQuoteDailyLayer2: string;
  logoLink: string;
  mainNet: boolean;
  maxFee: string;
  maxFeeForCtAddr: string;
  maxWd: string;
  minDep: string;
  minDepArrivalConfirm: string;
  minFee: string;
  minFeeForCtAddr: string;
  minWd: string;
  minWdUnlockConfirm: string;
  name: string;
  needTag: boolean;
  usedDepQuotaFixed: string;
  usedWdQuota: string;
  wdQuota: string;
  wdTickSz: string;
  active: boolean;
}
