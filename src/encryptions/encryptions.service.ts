import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EncryptionsService {
  constructor(private configService: ConfigService) {}

  encrypt(data: string): string {
    const encryptionKey = this.configService.get<string>('app.x-api-key', {
      infer: true,
    });
    if (!encryptionKey) {
      throw new Error('Encryption key not found in configuration');
    }

    const dataBuffer = Buffer.from(data, 'utf8');
    const keyBuffer = Buffer.from(encryptionKey, 'utf8');
    const encryptedBuffer = Buffer.alloc(dataBuffer.length);

    for (let i = 0; i < dataBuffer.length; i++) {
      encryptedBuffer[i] = dataBuffer[i] ^ keyBuffer[i % keyBuffer.length];
    }

    return encryptedBuffer.toString('hex');
  }

  decrypt(encryptedData: string): string {
    const encryptionKey = this.configService.get<string>('app.x-api-key', {
      infer: true,
    });
    if (!encryptionKey) {
      throw new Error('Encryption key not found in configuration');
    }

    const encryptedBuffer = Buffer.from(encryptedData, 'hex');
    const keyBuffer = Buffer.from(encryptionKey, 'utf8');
    const decryptedBuffer = Buffer.alloc(encryptedBuffer.length);

    for (let i = 0; i < encryptedBuffer.length; i++) {
      decryptedBuffer[i] = encryptedBuffer[i] ^ keyBuffer[i % keyBuffer.length];
    }

    return decryptedBuffer.toString('utf8');
  }
}
