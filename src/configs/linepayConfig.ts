const ngrokbaseUrl = 'https://3284-180-177-110-215.ngrok-free.app';
const baseUrl ='http://localhost:5173';
export default {
  redirectUrls: {
    confirmUrl: `${baseUrl}/linepay/confirm`,
    cancelUrl: `${baseUrl}/linepay/cancel`,
  },
};
