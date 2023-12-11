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

export interface Session {
  id: number;
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  address: string | undefined;
  mobileNumber: string | undefined;
  role: string | undefined;
  privileges: string[] | undefined;
  roleName: string | undefined;
  subAccount: string;
}

export interface CustomRequest extends Request {
  apiConfiguration: ApiConfiguration;
  session: Session;
}
