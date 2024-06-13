import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient } from 'redis';
import { DecodedJwt, MultiFactorSession, RedisSession } from './abstract';
import { MultiFactorType, SessionType } from './enum';

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
}
