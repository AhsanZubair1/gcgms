// api-key.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly validApiKey?: string;

  constructor(private configService: ConfigService) {
    this.validApiKey = this.configService.get<string>('app.x-api-key', {
      infer: true,
    });
    if (!this.validApiKey) {
      throw new Error('API_KEY environment variable is not set');
    }
  }
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey =
      request.headers['x-api-key'] ||
      request.headers['X-API-KEY'] ||
      request.headers['X-Api-Key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    if (apiKey !== this.validApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
