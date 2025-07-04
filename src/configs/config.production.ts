import type { Config } from '../types/configType.js';

const baseUrl = 'https://shopping-web-grok.vercel.app';
const config: Config = {
  linepayredirectUrls: {
    confirmUrl: `${baseUrl}/linepay/confirm`,
    cancelUrl: `${baseUrl}/linepay/cancel`,
  },
  ecpayAioCheckOutconfigs: {
    MerchantID: '',
    ReturnURL: '',
    EncryptType: 1,
  },
  allowedOrigins: ['https://shopping-web-grok.vercel.app', 'https://localhost:5173'],
  redisconfig: {
    username: 'default',
    host: 'redis-11502.crce185.ap-seast-1-1.ec2.redns.redis-cloud.com',
    port: 11502,
  },
  csrfCookieOptions: {
    httpOnly: false,
    sameSite: 'none',
    secure: true,
    maxAge: 3 * 60 * 1000, // 3 minutes
  },
  tpaccessTokenCookieOptions: {
    httpOnly: false,
    sameSite: 'none',
    secure: true,
    maxAge: 3 * 60 * 1000,
  },
  tprefreshTokenCookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};

export default config;
