import { GcCmsOtp } from '@src/otps/domain/otp';

export abstract class OtpAbstractRepository {
  abstract create(
    data: Omit<GcCmsOtp, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<GcCmsOtp>;

  abstract findValidOtp(
    email: string,
    otp?: string | null,
  ): Promise<GcCmsOtp | null>;

  abstract markAsUsed(id: number): Promise<void>;
  abstract existsValidOtpByPhone(email: string, otp: string): Promise<boolean>;
}
