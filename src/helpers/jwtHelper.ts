import jwt from 'jsonwebtoken';
import env from '../configs/env.js';
import * as redisHelper from './redisHelper.js';

const JwtKEY: jwt.Secret = env.JWTKEY;
const JwtSignoptions: object = { algorithm: 'HS256', expiresIn: '1 days' };

async function createJwt(mobilephone: string, password: string): Promise<string> {
  const payload = { MobilePhone: mobilephone, password: password };
  const token = jwt.sign(payload, JwtKEY, JwtSignoptions);
  await redisHelper.setData([mobilephone, token]);
  return token;
}

async function verifyJwt(token: string): Promise<boolean> {
  try {
    const decodedjwt = jwt.verify(token, JwtKEY, JwtSignoptions);
    if (typeof decodedjwt !== 'string' && typeof decodedjwt.MobilePhone == 'string') {
      const checkJwtToken = await redisHelper.getData(decodedjwt.MobilePhone);
      if (checkJwtToken[0]) {
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
