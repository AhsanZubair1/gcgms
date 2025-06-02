import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  Patch,
  SerializeOptions,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthUserType } from '@src/auth/dto/auth-user.dto';
import { ForgetPasswordOtpVerifyDto } from '@src/auth/dto/forget-password-otp-verify.dto';
import { AuthResetPasswordDto } from '@src/auth/dto/reset-password.dto';
import { User } from '@src/users/domain/user';
import { AuthUser } from '@src/utils/decorators/auth.decorator';
import { NullableType } from '@src/utils/types/nullable.type';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { RequestForgotPasswordDto } from './dto/request-forgot-password-otp.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: AuthLoginDto,
  ): Promise<LoginResponseDto> {
    return await this.service.validateLogin(loginDto);
  }

  @Post('forget/password/otp')
  async forgetPasswordOtp(
    @Body() dto: RequestForgotPasswordDto,
  ): Promise<{ data: string }> {
    return this.service.forgetPasswordOtp(dto);
  }

  @Post('forget/password/otp/verify')
  async forgetPasswordOtpVerify(
    @Body() dtoOtp: ForgetPasswordOtpVerifyDto,
  ): Promise<{ data: string }> {
    return this.service.forgetPasswordOtpVerify(dtoOtp);
  }

  @Post('forgot/password')
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<{ data: string }> {
    return this.service.forgotPassword(forgotPasswordDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: RefreshResponseDto,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public refresh(@Request() request): Promise<Partial<RefreshResponseDto>> {
    return this.service.refreshToken({
      sessionId: request.user.sessionId,
      hash: request.user.hash,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Request() request): Promise<void> {
    await this.service.logout({
      sessionId: request.user.sessionId,
    });
  }

  @ApiBearerAuth()
  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: User,
  })
  public update(
    @Request() request,
    @Body() userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    return this.service.update(request.user, userDto);
  }

  @ApiBearerAuth()
  @Post('reset/password')
  @UseGuards(AuthGuard('jwt'))
  resetPassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
    @AuthUser() user: AuthUserType,
  ): Promise<{ data: string }> {
    return this.service.resetPassword(resetPasswordDto, user);
  }

  // @ApiBearerAuth()
  // @Delete('me')
  // @UseGuards(AuthGuard('jwt'))
  // @HttpCode(HttpStatus.NO_CONTENT)
  // public async delete(@Request() request): Promise<void> {
  //   return this.service.softDelete(request.user);
  // }
}
