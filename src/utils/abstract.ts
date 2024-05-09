import {
  AuthenticationType,
  Country,
  MultiFactorType,
  MultiFactorValidationStatus,
  SessionType,
  VerificationType,
} from './enum';

export interface ApiConfiguration {
  secretKey: string;
  apiKey: string;
  passphrase: string;
}

export interface AuthorizedUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  dialingCode?: string;
  subAccount: string;
  country?: Country;
  authenticationType: AuthenticationType;
  authenticatorSecretKey?: string;
  antiPhishingCode?: string;
  emailVerifyEnable: boolean;
  smsVerifyEnable: boolean;
  authenticatorVerifyEnable: boolean;
  restrictionEndTime?: number;
}

export interface RedisSession {
  id: string;
  apiConfiguration: ApiConfiguration;
  user: AuthorizedUser;
  sessionType: SessionType;
}

export interface DecodedJwt {
  email: string;
  iat: number;
  exp: number;
}

export interface MultiFactorInfo {
  email: string;
  emailValidation: MultiFactorValidationStatus;
  emailCode?: string;
  emailCodeExpiration: number;

  mobileNumber: string;
  dialingCode: string;
  smsValidation: MultiFactorValidationStatus;
  smsCode?: string;
  smsCodeExpiration: number;

  authenticatorSecretKey: string;
  authenticatorValidation: MultiFactorValidationStatus;

  newVerificationType?: VerificationType;
  newVerificationCode?: string;
  newVerificationCodeExpiration?: number;
  newVerificationValidation?: MultiFactorValidationStatus;
  newVerificationParam?: string;

  expireAt: number;

  status: boolean;
}

export interface MultiFactorSession {
  token: string;
  multiFactorInfo: MultiFactorInfo;
  multiFactorType: MultiFactorType;
}

export interface CustomOkxResponse<T> {
  status: number;
  code: string;
  message: string;
  data: T[];
}

export interface ValidationError {
  response: {
    message: [];
    error: string;
    statusCode: number;
  };
  status: number;
  options: object;
  message: string;
  name: string;
}
