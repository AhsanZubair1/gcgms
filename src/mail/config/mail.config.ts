import { registerAs } from '@nestjs/config';
import { IsString, IsEmail } from 'class-validator';

import validateConfig from '@src/utils/validate-config';

import { MailConfig } from './mail-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  SENDGRID_API_KEY: string;

  @IsString()
  SENDGRID_SENDER_EMAIL: string;

  @IsEmail()
  SENDGRID_CC_EMAIL: string;
}

export default registerAs<MailConfig>('mail', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    sandGridApiKey: process.env.SENDGRID_API_KEY,
    senderEmail: process.env.SENDGRID_SENDER_EMAIL,
    ccMail: process.env.SENDGRID_CC_EMAIL,
  };
});
