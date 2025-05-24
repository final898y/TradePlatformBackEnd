import * as jose from 'jose';
import { z } from 'zod';
import ItransportResult from '../model/transportModel.js';
import * as authModel from '../model/authModel.js';

async function createJwt(
  mobilephone: string,
  email: string,
  jwtKey: string,
  expiration: string,
): Promise<string> {
  try {
    const payload = { mobilephone, email };

    // 將密鑰 (string) 轉換為 Uint8Array
    const secretKey = new TextEncoder().encode(jwtKey);

    // 使用 jose 進行簽名
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' }) // 設定演算法
      .setExpirationTime(expiration) // 設定過期時間
      .sign(secretKey); // 使用密鑰簽名
    return token;
  } catch (error) {
    if (error instanceof jose.errors.JOSEError) {
      console.error(`JOSEError occurred: ${error.code}: ${error.message}`);
    } else {
      console.error(`An unexpected error occurred: ${JSON.stringify(error)}`);
    }
    throw error;
  }
}

async function verifyJwt(
  token: string,
  jwtKey: string,
): Promise<ItransportResult<authModel.tpjwtPayload>> {
  try {
    // 將密鑰 (string) 轉換為 Uint8Array
    const secretKey = new TextEncoder().encode(jwtKey);

    // 使用 jose 進行驗證
    const { payload } = await jose.jwtVerify(token, secretKey, { algorithms: ['HS256'] });
    if (
      payload.mobilephone &&
      typeof payload.mobilephone === 'string' &&
      payload.email &&
      typeof payload.email === 'string'
    ) {
      return {
        success: true,
        statusCode: 200,
        message: '驗證成功',
        data: { mobilephone: payload.mobilephone, email: payload.email },
      };
    } else {
      return {
        success: false,
        statusCode: 401,
        message: '驗證失敗',
      };
    }
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      console.error(
        `JWT is expired.: ${error.code}: ${error.claim}: ${error.reason}:${error.message}`,
      );
      return {
        success: true,
        statusCode: 401,
        message: 'JWT is expired',
      };
    } else if (error instanceof jose.errors.JWTInvalid) {
      console.error(`JWT is invalid.: ${error.code}:${error.message}`);
      return {
        success: false,
        statusCode: 401,
        message: 'JWT is invalid',
      };
    } else {
      console.error(`An unexpected error occurred: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}

export { createJwt, verifyJwt };
