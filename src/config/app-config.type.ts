export type AppConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
  'x-api-key'?: string;
  loggingGroup?: string;
  loggingStream?: string;
  loggingRegion?: string;
  maskedFields: ['password', 'militaryId', 'mykadId', 'identifierValue'];
};
