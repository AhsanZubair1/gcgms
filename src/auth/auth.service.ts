import crypto from 'crypto';

import { Injectable, Logger } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import ms from 'ms';

import { AuthForgotPasswordDto } from '@src/auth/dto/auth-forgot-password.dto';
import { AuthUserType } from '@src/auth/dto/auth-user.dto';
import { ForgetPasswordOtpVerifyDto } from '@src/auth/dto/forget-password-otp-verify.dto';
import { AuthResetPasswordDto } from '@src/auth/dto/reset-password.dto';
import {
  FORBIDDEN,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from '@src/common/exceptions';
import { AllConfigType } from '@src/config/config.type';
import { EventService } from '@src/event/event.service';
import { I18nTranslationService } from '@src/i18n/i18n.service';
import { ErrorKey, ResponseKey } from '@src/i18n/translation-keys';
import { MailService } from '@src/mail/mail.service';
import { NotificationsService } from '@src/notifications/notifications.service';
import { OtpsService } from '@src/otps/otps.service';
import { GcCmsSession } from '@src/session/domain/session';
import { SessionService } from '@src/session/session.service';
import { GcCmsUser } from '@src/users/domain/gc-cms-user';
import { User } from '@src/users/domain/user';
import { UsersService } from '@src/users/users.service';
import { NullableType } from '@src/utils/types/nullable.type';

import { AuthLoginDto } from './dto/auth-email-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RequestForgotPasswordDto } from './dto/request-forgot-password-otp.dto';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name, { timestamp: true });
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionService: SessionService,
    private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
    private readonly otpService: OtpsService,
    private readonly i18n: I18nTranslationService,
    private eventService: EventService,
    private readonly notificationService: NotificationsService,
  ) {}

  async validateLogin(loginDto: AuthLoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw UNPROCESSABLE_ENTITY(ErrorKey.INCORRECT_CREDENTIAL, 'id');
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw UNPROCESSABLE_ENTITY(ErrorKey.INCORRECT_CREDENTIAL, 'password');
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.create({
      gcCmsUser: user,
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      category: user.gcCmsCategory.id,
      sessionId: session.id,
      hash,
    });

    return {
      refreshToken: refreshToken,
      token,
      tokenExpires: tokenExpires,
      user,
    };
  }

  async forgetPasswordOtp(
    dto: RequestForgotPasswordDto,
  ): Promise<{ data: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw UNPROCESSABLE_ENTITY(ErrorKey.INCORRECT_EMAIL, 'email');
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.otpService.create({
      email: user.email,
      phoneNumber: null,
      otp: otp,
      userId: user.id,
    });
    return { data: await this.i18n.translate(ErrorKey.OTP_SENT_SUCCESSFULLY) };
  }

  async forgetPasswordOtpVerify(
    dto: ForgetPasswordOtpVerifyDto,
  ): Promise<{ data: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user?.email) {
      throw UNPROCESSABLE_ENTITY(ErrorKey.INCORRECT_EMAIL, 'email');
    }
    const verify = await this.otpService.verify(dto);
    if (!verify) {
      throw FORBIDDEN(ErrorKey.OTP_VERIFICATION_FAILED, 'email');
    }
    return { data: await this.i18n.otpVerified() };
  }

  async forgotPassword(
    forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<{ data: string }> {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      throw FORBIDDEN(ErrorKey.INCORRECT_EMAIL, forgotPasswordDto.email);
    }
    const otp = await this.otpService.checkValidOtpExists(
      forgotPasswordDto.email,
      forgotPasswordDto.otp,
    );
    if (!otp) {
      throw FORBIDDEN(ErrorKey.OTP_VERIFICATION_FAILED, forgotPasswordDto.otp);
    }

    if (user) {
      user.password = forgotPasswordDto.password;
      await this.sessionService.deleteByUserId({
        userId: user?.id,
      });
      await this.usersService.update(user.id, user);
    }
    return {
      data: await this.i18n.translate(ResponseKey.PASSWORD_UPDATED),
    };
  }

  async update(
    userJwtPayload: JwtPayloadType,
    userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    const currentUser = (await this.usersService.findById(
      userJwtPayload.id,
    )) as User;

    if (userDto.password) {
      if (!userDto.oldPassword) {
        throw UNPROCESSABLE_ENTITY(ErrorKey.NOT_PRESENT, 'oldPassword');
      }

      if (!currentUser.password) {
        throw UNPROCESSABLE_ENTITY(ErrorKey.NOT_PRESENT, 'password');
      }

      const isValidOldPassword = await bcrypt.compare(
        userDto.oldPassword,
        currentUser.password,
      );

      if (!isValidOldPassword) {
        throw UNPROCESSABLE_ENTITY(
          ErrorKey.INCORRECT_CREDENTIAL,
          'oldPassword',
        );
      } else {
        await this.sessionService.deleteByUserIdWithExclude({
          userId: currentUser.id,
          excludeSessionId: userJwtPayload.sessionId,
        });
      }
    }

    if (userDto.email && userDto.email !== currentUser.email) {
      const userByEmail = await this.usersService.findByEmail(userDto.email);

      if (userByEmail && userByEmail.id !== currentUser.id) {
        throw FORBIDDEN(ErrorKey.INCORRECT_EMAIL, 'email');
      }

      await this.jwtService.signAsync(
        {
          confirmEmailUserId: currentUser.id,
          newEmail: userDto.email,
        },
        {
          secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
            infer: true,
          }),
        },
      );

      // await this.mailService.confirmNewEmail({
      //   to: userDto.email,
      //   data: {
      //     hash,
      //   },
      // });
    }

    delete userDto.email;
    delete userDto.oldPassword;

    await this.usersService.update(userJwtPayload.id, userDto);

    return this.usersService.findById(userJwtPayload.id);
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId' | 'hash'>,
  ): Promise<Omit<LoginResponseDto, 'user'>> {
    const session = (await this.sessionService.findById(
      data.sessionId,
    )) as GcCmsSession;

    if (session.hash !== data.hash) {
      throw UNAUTHORIZED(ErrorKey.INVALID_SESSION, 'session');
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const user = await this.usersService.findById(session.gcCmsUser.id);

    if (!user?.category) {
      throw UNAUTHORIZED(ErrorKey.USER_NOT_FOUND_WITH_VALID_ROLE, 'role');
    }

    await this.sessionService.update(session.id, {
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: session.gcCmsUser.id,
      category: user.category.id,
      sessionId: session.id,
      hash,
    });

    return {
      token,
      refreshToken: refreshToken,
      tokenExpires: tokenExpires,
    };
  }

  // async softDelete(user: User): Promise<void> {
  //   await this.usersService.remove(user.id);
  // }

  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>) {
    return this.sessionService.deleteById(data.sessionId);
  }

  private async getTokensData(data: {
    id: GcCmsUser['id'];
    category: string;
    sessionId: GcCmsSession['id'];
    hash: GcCmsSession['hash'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          category: data.category,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const userServiceFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // captilize first letter of the field name
    if (typeof this.usersService[userServiceFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        ErrorKey.METHOD_NOT_FOUND,
        field,
        undefined,
        'UsersRepository',
        userServiceFunction,
      );
    }

    const user = await this.usersService[userServiceFunction](value);
    if (!user) {
      throw FORBIDDEN(ErrorKey.CREDENTIALS_NOT_FOUND, value);
    }
    return user;
  }

  async resetPassword(
    authResetPasswordDto: AuthResetPasswordDto,
    authUser: AuthUserType,
  ): Promise<{ data: string }> {
    const user = await this.usersService.findGcCmsUserById(authUser.id);
    if (!user) {
      throw FORBIDDEN(ErrorKey.INCORRECT_CREDENTIAL, 'user');
    }

    const isValidPassword = await bcrypt.compare(
      authResetPasswordDto.password,
      user?.password,
    );

    if (!isValidPassword) {
      throw UNPROCESSABLE_ENTITY(ErrorKey.INCORRECT_PASSWORD, 'password');
    }

    if (authResetPasswordDto.newPassword) {
      user.password = authResetPasswordDto.newPassword;
    }

    await this.sessionService.deleteByUserId({
      userId: user.id,
    });

    await this.usersService.update(user.id, user);
    return {
      data: await this.i18n.translate(ResponseKey.PASSWORD_SET),
    };
  }
}
