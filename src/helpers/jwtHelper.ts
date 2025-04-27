import { SignJWT, jwtVerify } from 'jose';
import * as redisHelper from './redisHelper.js';

async function createJwt(mobilephone: string, email: string, jwtKey: string): Promise<string> {
  const payload = { mobilephone, email };

  // 將密鑰 (string) 轉換為 Uint8Array
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(jwtKey);

  // 使用 jose 進行簽名
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' }) // 設定演算法
    .setExpirationTime('1d') // 設定過期時間
    .sign(secretKey); // 使用密鑰簽名

  await redisHelper.setData(mobilephone, token);
  return token;
}

async function verifyJwt(token: string, jwtKey: string): Promise<boolean> {
  try {
    // 將密鑰 (string) 轉換為 Uint8Array
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(jwtKey);

    // 使用 jose 進行驗證
    const { payload } = await jwtVerify(token, secretKey, { algorithms: ['HS256'] });

    // 檢查有效性
    if (typeof payload.MobilePhone === 'string') {
      const checkJwtToken = await redisHelper.getData(payload.MobilePhone);
      if (checkJwtToken.success) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log(`verifyJwt Error : ${JSON.stringify(error)}`);
    return false;
  }
}

export { createJwt, verifyJwt };
