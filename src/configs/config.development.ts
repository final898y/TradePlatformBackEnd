import type { Config } from '../types/configType.js';

const ngrokbaseUrl = 'https://a4a4-123-195-193-252.ngrok-free.app';
const baseUrl = 'http://localhost:5173';
const config: Config = {
  linepayredirectUrls: {
    confirmUrl: `${baseUrl}/linepay/confirm`,
    cancelUrl: `${baseUrl}/linepay/cancel`,
  },
  ecpayAioCheckOutconfigs: {
    MerchantID: '3002607',
    ReturnURL: `${ngrokbaseUrl}/api/pay/ecpay/getpayresult`,
    EncryptType: 1,
  },
  allowedOrigins: [
    'http://localhost:3000',
    'https://localhost:443',
    'http://localhost:5173',
    'https://localhost:5173',
  ],
  redisconfig: {
    username: 'default',
    host: 'redis-11502.crce185.ap-seast-1-1.ec2.redns.redis-cloud.com',
    port: 11502,
  },
  csrfCookieOptions: {
    httpOnly: false,
    sameSite: 'lax', // 開發階段用 lax 避免跨域問題
    secure: false, // 開發不強制 HTTPS
    maxAge: 3 * 60 * 1000,
  },
  tpaccessTokenCookieOptions: {
    httpOnly: false,
    sameSite: 'lax',
    secure: false,
    maxAge: 3 * 60 * 1000,
  },
  tprefreshTokenCookieOptions: {
    httpOnly: false,
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};
export default config;
