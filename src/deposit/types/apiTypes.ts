export interface ApiResponse<T> {
  status: number;
  code: string;
  message: string;
  data?: T;
}

export interface ApiConfiguration {
  secretKey: string | undefined;
  apiKey: string | undefined;
  passphrase: string | undefined;
}

export interface CustomRequest extends Request {
  apiConfiguration: ApiConfiguration;
}
