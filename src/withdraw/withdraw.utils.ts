import * as CryptoJS from 'crypto-js';
import { okxResponse } from './types/okxResponse';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WithdrawUtils {
  // create sign string for oxk requests
  private sign(
    timestamp: string,
    method: string,
    secretKey: string,
    path: string,
    body: Record<string, any> | string,
  ) {
    return CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(
        timestamp +
          method +
          path +
          (typeof body === 'string' ? body : JSON.stringify(body)),
        secretKey,
      ),
    );
  }

  // prepare header for okx requests
  private prepareHeader(
    url: string,
    method: string,
    queries?: string | undefined,
    body?: Record<string, any>,
  ): Record<string, string> {
    const date = new Date();
    const query: string = queries ? queries : '';

    // configure signature
    const signature = this.sign(
      date.toISOString(),
      method,
      process.env.OKX_SECRET_KEY,
      url + query,
      body ? body : '',
    );

    // configure okx api header
    const okxHeader = {
      'OK-ACCESS-KEY': process.env.OKX_API_KEY,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': date.toISOString(),
      'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE,
    };

    return okxHeader;
  }

  public async okxCall<T>({
    url,
    params,
    headers,
    method,
    body,
  }: {
    url: string;
    params?: Record<string, string>;
    headers?: Record<string, string>;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: Record<string, string>;
  }): Promise<{
    status: number;
    code: string;
    message: string;
    data: T;
  }> {
    // search queries
    let query: string = '';
    if (params) {
      query = '?';

      Object.entries(params).map(([k, v], i) => {
        query =
          query +
          `${k}=${v}` +
          (i !== Object.entries(params).length - 1 ? '&' : '');
      });
    }

    // create signature
    const date = new Date();

    // configure headers
    const okxHeader = this.prepareHeader(url, method, query, body);

    const header = {
      'content-type': 'application/json',
      accept: 'application/json',
      ...okxHeader,
      ...headers,
    };

    const data = await fetch(process.env.OKX_URL + url + query, {
      method: method,
      headers: header,
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        const status = res.status;

        const result: okxResponse<T> = await res.json();

        const response = {
          status: res.status,
          code: result.code,
          message: result.msg,
          data: result.data,
        };

        return response;
      })
      .catch((e: Error) => {
        return {
          status: 500,
          code: e.message,
          message: e.message,
          data: undefined,
        };
      });

    return data;
  }
}
