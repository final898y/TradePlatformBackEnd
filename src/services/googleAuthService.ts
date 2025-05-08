import { jwtVerify, createRemoteJWKSet } from 'jose';
import { z } from 'zod';
import ItransportResult from '../model/transportModel.js';
import * as googleAuthRepository from '../repositorys/googleAuthRepository.js';

const googleIdTokenPayloadSchema = z.object({
  iss: z.literal('https://accounts.google.com'), // 發行者必須是固定值
  nbf: z.number(), // Not Before 時間戳（可選驗證範圍）
  aud: z.string(), // audience，通常是你的 client ID
  sub: z.string(), // 使用者的 Google 帳號唯一 ID
  hd: z.string().optional(), // GSuite domain，可能不存在
  email: z.string().email(), // 使用者 Email
  email_verified: z.boolean(), // Email 是否已驗證
  azp: z.string(), // 授權的 party，通常等於 aud
  name: z.string(), // 使用者全名
  picture: z.string().url().optional(), // 頭像網址，可能不存在
  given_name: z.string(), // 名
  family_name: z.string().optional(), // 姓
  iat: z.number(), // token 發行時間（Unix 時間戳）
  exp: z.number(), // token 過期時間（Unix 時間戳）
  jti: z.string(), // JWT ID（唯一識別符）
});

type googleJWTPayload = z.infer<typeof googleIdTokenPayloadSchema>;

const userPhoneEmailSchema = z.object({
  mobilephone: z.string(),
  email: z.string(),
});

type userPhoneEmail = z.infer<typeof userPhoneEmailSchema>;

export const verifyGoogleIdToken = async (
  credential: string,
): Promise<ItransportResult<userPhoneEmail>> => {
  try {
    const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
    const { payload } = await jwtVerify(credential, GOOGLE_JWKS, {
      issuer: 'https://accounts.google.com',
      audience: '359200533687-87lah0su6ufvh34gi1c14mt0sudrpp21.apps.googleusercontent.com', // ← 替換成你自己的 Client ID
    });
    const parsedPayload = googleIdTokenPayloadSchema.parse(payload);
    const gooleIDChecked = await googleAuthRepository.verifyGoogleIdToken(parsedPayload.sub);
    if (!gooleIDChecked?.success || gooleIDChecked.data === undefined) {
      return {
        success: false,
        statusCode: 404,
        message: 'This Google Account is not registered.',
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: 'This Google Account is registered.',
      data: {
        mobilephone: gooleIDChecked.data, //userData.mobilephone
        email: parsedPayload.email,
      },
    };
  } catch (error) {
    throw error;
  }
};
