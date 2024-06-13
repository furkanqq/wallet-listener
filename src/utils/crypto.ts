import { Injectable } from '@nestjs/common';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

@Injectable()
export class CryptoService {
  encrypt(text: string, secret: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv(
      'aes-256-cbc',
      Buffer.from(secret, 'hex'),
      iv,
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decrypt(encrypted: string, secret: string): string {
    const [iv, encryptedText] = encrypted
      .split(':')
      .map((part) => Buffer.from(part, 'hex'));
    const decipher = createDecipheriv(
      'aes-256-cbc',
      Buffer.from(secret, 'hex'),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
