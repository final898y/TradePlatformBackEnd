const baseUrl = 'https://shopping-web-grok.vercel.app';
export default {
  linepayredirectUrls: {
    confirmUrl: `${baseUrl}/linepay/confirm`,
    cancelUrl: `${baseUrl}/linepay/cancel`,
  },
  allowedOrigins: ['https://shopping-web-grok.vercel.app', 'https://localhost:5173'],
  redisconfig: {
    username: 'default',
    host: 'redis-15546.crce194.ap-seast-1-1.ec2.redns.redis-cloud.com',
    port: 15546,
  },
};
