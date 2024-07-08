import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient } from 'redis';
import { DecodedJwt, MultiFactorSession, RedisSession } from './abstract';
import { MultiFactorType, SessionType } from './enum';
import { DepositAddress } from 'src/schema/deposit.schema';
import { Coin } from 'src/schema/coin.schema';

@Injectable()
export class RedisService {
  private connectRedis(): ReturnType<typeof createClient> {
    const client = createClient({
      url: process.env.REDIS_URI,
    });

    client.connect();

    return client;
  }

  async getRedisSession(token: string): Promise<RedisSession> {
    const client = this.connectRedis();

    const sessionKeys = await client.sMembers('redis_session');

    if (sessionKeys && sessionKeys.length > 0) {
      const isTokenValid = sessionKeys.includes(token);

      if (isTokenValid) {
        const jwtService = new JwtService();
        const decodedJwt: DecodedJwt = jwtService.decode(token);
        const expirationDate: Date = new Date(decodedJwt.exp * 1000);

        if (expirationDate <= new Date()) {
          return null;
        }

        const session = await client.hGetAll(`redis_session:${token}`);

        if (session) {
          return {
            id: session.id,
            // apiConfiguration: JSON.parse(session.apiConfiguration),
            user: JSON.parse(session.user),
            sessionType: session.sessionType as SessionType,
          };
        }
      }
    }
    return null;
  }

  async checkRedisSession(token: string): Promise<boolean> {
    const client = this.connectRedis();

    const sessionKeys = await client.sMembers('redis_session');

    if (sessionKeys && sessionKeys.length > 0) {
      const isTokenValid = sessionKeys.includes(token);

      if (isTokenValid) {
        const jwtService = new JwtService();
        const decodedJwt: DecodedJwt = jwtService.decode(token);
        const expirationDate: Date = new Date(decodedJwt.exp * 1000);

        if (expirationDate <= new Date()) {
          return false;
        }

        const session = await client.hGetAll(`redis_session:${token}`);
        const redisSession: RedisSession = JSON.parse(JSON.stringify(session));

        if (redisSession.sessionType === SessionType.FORGOT) return false;

        if (redisSession.id) return true;
      }
    }

    return false;
  }
  async getMultiFactorSession(
    token: string,
    multiFactorType: MultiFactorType,
  ): Promise<MultiFactorSession> {
    const client = this.connectRedis();

    const sessionKeys = await client.sMembers(
      `${multiFactorType}_VERIFICATION_SESSIONS`,
    );

    if (sessionKeys && sessionKeys.length > 0) {
      const isTokenValid = sessionKeys.includes(token);

      if (isTokenValid) {
        const jwtService = new JwtService();
        const decodedJwt: DecodedJwt = jwtService.decode(token);
        const expirationDate: Date = new Date(decodedJwt.exp * 1000);

        if (expirationDate <= new Date()) {
          return null;
        }

        const session = await client.hGetAll(
          `${multiFactorType}_VERIFICATION_SESSIONS:${token}`,
        );

        if (session.token) {
          return {
            token: session.token,
            multiFactorInfo: JSON.parse(session.multiFactorInfo),
            multiFactorType: session.multiFactorType as MultiFactorType,
          };
        }
      }
    }
    return null;
  }

  async deleteMultiFactorSession(
    token: string,
    multiFactorType: MultiFactorType,
  ): Promise<void> {
    const client = this.connectRedis();

    await client.sRem(`${multiFactorType}_VERIFICATION_SESSIONS`, token);
    await client.del(`${multiFactorType}_VERIFICATION_SESSIONS:${token}`);
  }

  async addDepositAddressToRedis(
    depositAddress: Pick<DepositAddress, '_id' | 'addr'>,
  ): Promise<boolean> {
    const client = this.connectRedis();

    const isOk = await client
      .hSet(`deposit_address:${depositAddress._id}`, {
        _id: depositAddress._id,
        addr: depositAddress.addr,
      })
      .then(() => true)
      .catch(() => false);

    if (isOk) {
      return await client
        .sAdd('deposit_address', depositAddress._id)
        .then((res) => !!res)
        .catch(() => false);
    }

    return isOk;
  }

  async getAllDepositAddressFromRedis(): Promise<
    Pick<DepositAddress, '_id' | 'addr'>[]
  > {
    const client = this.connectRedis();

    const depositAddressKeys = await client.sMembers('deposit_address');
    let depositAddresses = [];
    if (depositAddressKeys && depositAddressKeys.length > 0) {
      depositAddresses = await Promise.all(
        depositAddressKeys.map(async (key) => {
          const depositAddress = await client.hGetAll(`deposit_address:${key}`);
          return depositAddress;
        }),
      );
    }
    return depositAddresses;
  }

  async addCoinAddressToRedis(
    coinAddress: Pick<Coin, '_id' | 'address'>,
  ): Promise<boolean> {
    const client = this.connectRedis();

    const isOk = await client
      .hSet(`coin_address:${coinAddress._id}`, {
        _id: coinAddress._id,
        address: coinAddress.address,
      })
      .then(() => true)
      .catch(() => false);

    if (isOk) {
      return await client
        .sAdd('coin_address', coinAddress._id)
        .then((res) => !!res)
        .catch(() => false);
    }

    return isOk;
  }

  async getAllCoinAddressFromRedis(): Promise<Pick<Coin, '_id' | 'address'>[]> {
    const client = this.connectRedis();

    const coinAddressKeys = await client.sMembers('coin_address');
    let coinAddresses = [];
    if (coinAddressKeys && coinAddressKeys.length > 0) {
      coinAddresses = await Promise.all(
        coinAddressKeys.map(async (key) => {
          const coinAddress = await client.hGetAll(`coin_address:${key}`);
          return coinAddress;
        }),
      );
    }
    return coinAddresses;
  }
}
