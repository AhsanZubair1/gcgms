import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { I18nTranslationService } from '@src/i18n/i18n.service';
import { ResponseKey } from '@src/i18n/translation-keys';

@Injectable()
export class VerificationGuard implements CanActivate {
  constructor(
    private readonly dataSource: DataSource,
    private readonly i18n: I18nTranslationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.id) {
      throw new UnauthorizedException('User ID missing in request.');
    }
    const result = await this.dataSource.query(
      `SELECT * FROM "users" WHERE id = $1`,
      [user.id],
    );

    const dbUser = result[0];

    if (!dbUser) {
      throw new UnauthorizedException('User not found.');
    }

    if (dbUser.verification_status !== 'APPROVED') {
      throw new ForbiddenException(
        await this.i18n.translate(ResponseKey.PENDING_STATE),
      );
    }

    // Optionally attach the complete user to request
    request.user = dbUser;

    return true;
  }
}
