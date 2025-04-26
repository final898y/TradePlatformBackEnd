const baseUrl = 'http://localhost:5173';
export default {
  linepayredirectUrls: {
    confirmUrl: `${baseUrl}/linepay/confirm`,
    cancelUrl: `${baseUrl}/linepay/cancel`,
  },
  allowedOrigins: [
    'http://localhost:3000',
    'https://localhost:443',
    'http://localhost:5173',
    'https://localhost:5173',
  ],
  redisconfig: {
    username: 'default',
    host: 'redis-15546.crce194.ap-seast-1-1.ec2.redns.redis-cloud.com',
    port: 15546,
  },
};
