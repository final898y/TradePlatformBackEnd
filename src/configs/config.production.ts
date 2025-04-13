const baseUrl = 'https://shopping-web-grok.vercel.app';
export default {
  linepayredirectUrls: {
    confirmUrl: `${baseUrl}/linepay/confirm`,
    cancelUrl: `${baseUrl}/linepay/cancel`,
  },
  allowedOrigins: ['https://shopping-web-grok.vercel.app', 'https://localhost:5173'],
};
