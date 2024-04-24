export interface ApiConfiguration {
  secretKey: string;
  apiKey: string;
  passphrase: string;
}

export interface AuthorizedUser {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  subAccount?: string;
}

export interface RedisSession {
  id: string;
  apiConfiguration: ApiConfiguration;
  user: AuthorizedUser;
}

export interface DecodedJwt {
  email: string;
  iat: number;
  exp: number;
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
