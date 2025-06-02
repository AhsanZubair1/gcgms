import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';
import * as firebase from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

import validateConfig from '@src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  FCM_PROJECT_ID: string;

  @IsString()
  @IsNotEmpty()
  FCM_PRIVATE_KEY: string;

  @IsString()
  @IsNotEmpty()
  FCM_CLIENT_EMAIL: string;
}

export default registerAs('notification', (): ServiceAccount => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  const privateKey = process.env.FCM_PRIVATE_KEY?.replace(/\\n/g, '\n');

  return {
    projectId: process.env.FCM_PROJECT_ID,
    privateKey: privateKey,
    clientEmail: process.env.FCM_CLIENT_EMAIL,
  };
});

export const initializeFirebase = (config: ServiceAccount) => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      credential: firebase.credential.cert(config),
    });
  }
  return firebase;
};
