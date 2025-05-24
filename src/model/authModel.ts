import { z } from 'zod';

export const tpjwtPayloadSchema = z.object({
  mobilephone: z.string(),
  email: z.string(),
});
export type tpjwtPayload = z.infer<typeof tpjwtPayloadSchema>;

export const AccessAndRefreshTokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type AccessAndRefreshToken = z.infer<typeof AccessAndRefreshTokenSchema>;

export const VerifiedTokenResultSchema = z.object({
  isjwtVerified: z.boolean(),
  isRedisVerified: z.boolean(),
  verifiedMobilephone: z.string().optional(),
  verifiedEmail: z.string().optional(),
});
export type VerifiedTokenResult = z.infer<typeof VerifiedTokenResultSchema>;
