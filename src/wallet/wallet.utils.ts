export function getApiConfiguration(): {
  secretKey: string;
  apiKey: string;
  passphrase: string;
} {
  return {
    secretKey: process.env.OKX_SECRET_KEY,
    apiKey: process.env.OKX_API_KEY,
    passphrase: process.env.OKX_PASSPHRASE,
  };
}
